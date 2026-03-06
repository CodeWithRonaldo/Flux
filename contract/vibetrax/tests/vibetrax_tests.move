#[test_only]
module vibetrax::vibetrax_tests {
    use iota::test_scenario::{Self as ts};
    use iota::coin::{Self};
    use iota::iota::IOTA;
    use iota::clock;
    use iota::coin_manager::CoinManager;
    use vibetrax::vibe_token::{Self, VibeTreasury, VIBE_TOKEN};
    use vibetrax::vibetrax::{Self, Music, Subscription, UserProfile};
    use std::ascii;

    // ── Test Addresses ────────────────────────────────────────────────────────
    const ADMIN:       address = @0xAD;
    const ARTIST:      address = @0xA1;
    const BUYER:       address = @0xB1;
    const COLLAB:      address = @0xC1;
    const SUBSCRIBER:  address = @0xD1;

    // ── Constants (must match vibetrax.move) ──────────────────────────────────
    const NANOS:              u64 = 1_000_000_000;
    const SUBSCRIPTION_PRICE: u64 = 5_000_000_000;
    const LIKE_VALUE_INCREASE: u64 = 2_000_000;
    const STREAM_TOKEN_REWARD: u64 = 10_000_000;
    const MAX_SUPPLY:          u64 = 10_000_000_000_000_000;
    const BOOST_PLAN_BASIC:    u64 = 100_000_000;
    const BOOST_PLAN_PRO:      u64 = 500_000_000;
    const BOOST_PLAN_ELITE:    u64 = 1_000_000_000;
    const BOOST_DURATION_BASIC_MS:  u64 = 7  * 24 * 60 * 60 * 1000;
    const BOOST_DURATION_PRO_MS:    u64 = 30 * 24 * 60 * 60 * 1000;
    const BOOST_DURATION_ELITE_MS:  u64 = 90 * 24 * 60 * 60 * 1000;
    const SUBSCRIPTION_DURATION_MS: u64 = 30 * 24 * 60 * 60 * 1000;

    // ── Setup: publish both modules ───────────────────────────────────────────
    fun setup(scenario: &mut ts::Scenario) {
        ts::next_tx(scenario, ADMIN);
        vibe_token::init_for_testing(ts::ctx(scenario));
        ts::next_tx(scenario, ADMIN);
        vibetrax::init_for_testing(ts::ctx(scenario));
    }

    // ── User factories ────────────────────────────────────────────────────────
    fun artist_user(): vibetrax::User {
        vibetrax::new_user(
            ascii::string(b"Artist One"), ARTIST,
            option::none(), option::none(), option::none()
        )
    }

    fun buyer_user(): vibetrax::User {
        vibetrax::new_user(
            ascii::string(b"Buyer One"), BUYER,
            option::none(), option::none(), option::none()
        )
    }

    fun collab_user(split: u64, has_royalty: bool): vibetrax::User {
        vibetrax::new_user(
            ascii::string(b"Collaborator"), COLLAB,
            option::some(ascii::string(b"Producer")),
            option::some(split),
            option::some(has_royalty)
        )
    }

    fun subscriber_user(): vibetrax::User {
        vibetrax::new_user(
            ascii::string(b"Subscriber"), SUBSCRIBER,
            option::none(), option::none(), option::none()
        )
    }

    // ── Upload a basic track as ARTIST (includes next_tx) ─────────────────────
    fun upload_track(scenario: &mut ts::Scenario, clock: &clock::Clock) {
        ts::next_tx(scenario, ARTIST);
        vibetrax::upload_music(
            ascii::string(b"Track One"),
            ascii::string(b"A great track"),
            ascii::string(b"Hip-Hop"),
            ascii::string(b"ipfs://image"),
            ascii::string(b"ipfs://preview"),
            ascii::string(b"ipfs://full"),
            10,
            vector::empty(),
            artist_user(),
            clock,
            ts::ctx(scenario)
        );
    }

    // ── Subscribe SUBSCRIBER (includes next_tx) ───────────────────────────────
    fun do_subscribe(scenario: &mut ts::Scenario, clock: &clock::Clock) {
        ts::next_tx(scenario, SUBSCRIBER);
        let payment = coin::mint_for_testing<IOTA>(SUBSCRIPTION_PRICE, ts::ctx(scenario));
        vibetrax::subscribe(subscriber_user(), payment, clock, ts::ctx(scenario));
    }

    // ── Fund ARTIST with `amount` VIBE from the reward pool ───────────────────
    // This keeps supply tracking consistent (coins come from TreasuryCap mint).
    fun fund_artist_vibe(scenario: &mut ts::Scenario, amount: u64) {
        ts::next_tx(scenario, ADMIN);
        let mut treasury = ts::take_shared<VibeTreasury>(scenario);
        vibe_token::pay_stream_reward(&mut treasury, amount, ARTIST, ts::ctx(scenario));
        ts::return_shared(treasury);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIBE TOKEN TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_vibe_init_full_supply_in_pool() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let treasury = ts::take_shared<VibeTreasury>(&scenario);
            assert!(vibe_token::reward_pool_balance(&treasury) == MAX_SUPPLY, 0);
            ts::return_shared(treasury);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_pay_stream_reward_deducts_pool() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let before = vibe_token::reward_pool_balance(&treasury);
            vibe_token::pay_stream_reward(&mut treasury, STREAM_TOKEN_REWARD, SUBSCRIBER, ts::ctx(&mut scenario));
            let after = vibe_token::reward_pool_balance(&treasury);
            assert!(before - after == STREAM_TOKEN_REWARD, 1);
            ts::return_shared(treasury);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_pay_stream_reward_noop_when_pool_empty() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            // Drain the entire pool
            vibe_token::pay_stream_reward(&mut treasury, MAX_SUPPLY, SUBSCRIBER, ts::ctx(&mut scenario));
            assert!(vibe_token::reward_pool_balance(&treasury) == 0, 2);
            // Second call must be a silent no-op, not an abort
            vibe_token::pay_stream_reward(&mut treasury, 1, SUBSCRIBER, ts::ctx(&mut scenario));
            assert!(vibe_token::reward_pool_balance(&treasury) == 0, 3);
            ts::return_shared(treasury);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_burn_vibe_succeeds() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        // Get VIBE from the reward pool so supply tracking is correct
        fund_artist_vibe(&mut scenario, BOOST_PLAN_BASIC);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let mut manager = ts::take_shared<CoinManager<VIBE_TOKEN>>(&scenario);
            let pool_before = vibe_token::reward_pool_balance(&treasury);
            let vibe = ts::take_from_address<coin::Coin<VIBE_TOKEN>>(&scenario, ARTIST);
            // Burning reduces pool-derived supply; call must not abort
            vibe_token::burn(&mut treasury, &mut manager, vibe);
            // The reward pool gave out the coins, so it still reflects the deduction
            assert!(vibe_token::reward_pool_balance(&treasury) == pool_before, 4);
            ts::return_shared(treasury);
            ts::return_shared(manager);
        };

        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UPLOAD MUSIC TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_upload_music_basic() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, ADMIN);
        {
            let music = ts::take_shared<Music>(&scenario);
            assert!(vibetrax::is_for_sale(&music), 5);
            assert!(vibetrax::price(&music) == 10 * NANOS, 6);
            assert!(vibetrax::likes(&music) == 0, 7);
            assert!(vibetrax::streaming_count(&music) == 0, 8);
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 2)]
    fun test_upload_music_zero_price_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, ARTIST);
        vibetrax::upload_music(
            ascii::string(b"Bad Song"), ascii::string(b"desc"),
            ascii::string(b"genre"), ascii::string(b"img"),
            ascii::string(b"preview"), ascii::string(b"full"),
            0, vector::empty(), artist_user(),
            &clock, ts::ctx(&mut scenario)
        );

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 4)]
    fun test_upload_music_wrong_signer_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        // BUYER signs but the User struct declares ARTIST — mismatch must abort
        ts::next_tx(&mut scenario, BUYER);
        vibetrax::upload_music(
            ascii::string(b"Fake Song"), ascii::string(b"desc"),
            ascii::string(b"genre"), ascii::string(b"img"),
            ascii::string(b"preview"), ascii::string(b"full"),
            10, vector::empty(), artist_user(),
            &clock, ts::ctx(&mut scenario)
        );

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 10)]
    fun test_upload_music_duplicate_collaborator_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, ARTIST);
        // Same COLLAB address appears twice
        let collabs = vector[collab_user(10, true), collab_user(10, true)];
        vibetrax::upload_music(
            ascii::string(b"Dup Song"), ascii::string(b"desc"),
            ascii::string(b"genre"), ascii::string(b"img"),
            ascii::string(b"preview"), ascii::string(b"full"),
            10, collabs, artist_user(),
            &clock, ts::ctx(&mut scenario)
        );

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PURCHASE TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_purchase_music_initial_sale_no_collabs() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(10 * NANOS, ts::ctx(&mut scenario));
            vibetrax::purchase_music_nft(&mut music, payment, buyer_user(), ts::ctx(&mut scenario));
            assert!(!vibetrax::is_for_sale(&music), 9);
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_purchase_music_initial_sale_with_collaborator() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        // Upload with a 20% collaborator
        ts::next_tx(&mut scenario, ARTIST);
        vibetrax::upload_music(
            ascii::string(b"Collab Song"), ascii::string(b"desc"),
            ascii::string(b"genre"), ascii::string(b"img"),
            ascii::string(b"preview"), ascii::string(b"full"),
            10,
            vector[collab_user(20, true)],
            artist_user(), &clock, ts::ctx(&mut scenario)
        );

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(10 * NANOS, ts::ctx(&mut scenario));
            vibetrax::purchase_music_nft(&mut music, payment, buyer_user(), ts::ctx(&mut scenario));
            assert!(!vibetrax::is_for_sale(&music), 10);
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 1)]
    fun test_purchase_not_for_sale_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        // First purchase succeeds
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(10 * NANOS, ts::ctx(&mut scenario));
            vibetrax::purchase_music_nft(&mut music, payment, buyer_user(), ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        // Second purchase while not for sale — must abort
        ts::next_tx(&mut scenario, COLLAB);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(10 * NANOS, ts::ctx(&mut scenario));
            let collab_as_buyer = vibetrax::new_user(
                ascii::string(b"Collab"), COLLAB,
                option::none(), option::none(), option::none()
            );
            vibetrax::purchase_music_nft(&mut music, payment, collab_as_buyer, ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 7)]
    fun test_purchase_wrong_amount_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(1, ts::ctx(&mut scenario)); // wrong
            vibetrax::purchase_music_nft(&mut music, payment, buyer_user(), ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LIKE TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_like_music_increments_likes_and_price() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let price_before = vibetrax::price(&music);
            vibetrax::like_music(&mut music, buyer_user(), ts::ctx(&mut scenario));
            assert!(vibetrax::likes(&music) == 1, 11);
            assert!(vibetrax::price(&music) == price_before + LIKE_VALUE_INCREASE, 12);
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 12)]
    fun test_like_music_twice_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            vibetrax::like_music(&mut music, buyer_user(), ts::ctx(&mut scenario));
            vibetrax::like_music(&mut music, buyer_user(), ts::ctx(&mut scenario)); // must abort
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 11)]
    fun test_like_music_address_mismatch_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        // BUYER signs but passes artist_user (ARTIST address)
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            vibetrax::like_music(&mut music, artist_user(), ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SUBSCRIBE & STREAM TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_subscribe_creates_subscription_with_correct_expiry() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 0);

        do_subscribe(&mut scenario, &clock);

        ts::next_tx(&mut scenario, SUBSCRIBER);
        {
            let sub = ts::take_from_sender<Subscription>(&scenario);
            assert!(vibetrax::subscription_expiry(&sub) == SUBSCRIPTION_DURATION_MS, 13);
            ts::return_to_sender(&scenario, sub);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 7)]
    fun test_subscribe_wrong_price_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, SUBSCRIBER);
        let payment = coin::mint_for_testing<IOTA>(1, ts::ctx(&mut scenario));
        vibetrax::subscribe(subscriber_user(), payment, &clock, ts::ctx(&mut scenario));

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_stream_music_pays_vibe_and_increments_count() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1_000); // 1 second in

        upload_track(&mut scenario, &clock);
        do_subscribe(&mut scenario, &clock);

        ts::next_tx(&mut scenario, SUBSCRIBER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut sub = ts::take_from_sender<Subscription>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let pool_before = vibe_token::reward_pool_balance(&treasury);

            vibetrax::stream_music(
                &mut music, &mut sub, &mut treasury,
                subscriber_user(), &clock, ts::ctx(&mut scenario)
            );

            assert!(vibe_token::reward_pool_balance(&treasury) == pool_before - STREAM_TOKEN_REWARD, 14);
            assert!(vibetrax::streaming_count(&music) == 1, 15);
            ts::return_shared(music);
            ts::return_to_sender(&scenario, sub);
            ts::return_shared(treasury);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 13)]
    fun test_stream_music_twice_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1_000);

        upload_track(&mut scenario, &clock);
        do_subscribe(&mut scenario, &clock);

        ts::next_tx(&mut scenario, SUBSCRIBER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut sub = ts::take_from_sender<Subscription>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);

            vibetrax::stream_music(&mut music, &mut sub, &mut treasury, subscriber_user(), &clock, ts::ctx(&mut scenario));
            vibetrax::stream_music(&mut music, &mut sub, &mut treasury, subscriber_user(), &clock, ts::ctx(&mut scenario)); // must abort

            ts::return_shared(music);
            ts::return_to_sender(&scenario, sub);
            ts::return_shared(treasury);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 14)]
    fun test_stream_expired_subscription_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1_000);

        upload_track(&mut scenario, &clock);
        do_subscribe(&mut scenario, &clock);

        // Jump past the 30-day window
        clock::set_for_testing(&mut clock, 31 * 24 * 60 * 60 * 1000);

        ts::next_tx(&mut scenario, SUBSCRIBER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut sub = ts::take_from_sender<Subscription>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);

            vibetrax::stream_music(&mut music, &mut sub, &mut treasury, subscriber_user(), &clock, ts::ctx(&mut scenario));

            ts::return_shared(music);
            ts::return_to_sender(&scenario, sub);
            ts::return_shared(treasury);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIP TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_tip_artist_transfers_vibe() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let music = ts::take_shared<Music>(&scenario);
            // mint_for_testing is safe here — we're only transferring, not burning
            let tip = coin::mint_for_testing<VIBE_TOKEN>(50_000_000, ts::ctx(&mut scenario));
            vibetrax::tip_artist(&music, tip, ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 7)]
    fun test_tip_zero_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let music = ts::take_shared<Music>(&scenario);
            let tip = coin::mint_for_testing<VIBE_TOKEN>(0, ts::ctx(&mut scenario));
            vibetrax::tip_artist(&music, tip, ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // BOOST TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_boost_music_basic_plan() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 0);

        upload_track(&mut scenario, &clock);
        // Seed ARTIST with exactly 100 VIBE from the reward pool
        fund_artist_vibe(&mut scenario, BOOST_PLAN_BASIC);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let mut manager = ts::take_shared<CoinManager<VIBE_TOKEN>>(&scenario);
            let vibe = ts::take_from_sender<coin::Coin<VIBE_TOKEN>>(&scenario);

            vibetrax::boost_music(&mut music, &mut treasury, &mut manager, vibe, 0, &clock, ts::ctx(&mut scenario));

            assert!(vibetrax::boost_expiry(&music) == BOOST_DURATION_BASIC_MS, 16);
            ts::return_shared(music);
            ts::return_shared(treasury);
            ts::return_shared(manager);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_boost_music_pro_plan() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 0);

        upload_track(&mut scenario, &clock);
        fund_artist_vibe(&mut scenario, BOOST_PLAN_PRO);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let mut manager = ts::take_shared<CoinManager<VIBE_TOKEN>>(&scenario);
            let vibe = ts::take_from_sender<coin::Coin<VIBE_TOKEN>>(&scenario);

            vibetrax::boost_music(&mut music, &mut treasury, &mut manager, vibe, 1, &clock, ts::ctx(&mut scenario));

            assert!(vibetrax::boost_expiry(&music) == BOOST_DURATION_PRO_MS, 17);
            ts::return_shared(music);
            ts::return_shared(treasury);
            ts::return_shared(manager);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_boost_music_elite_plan() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 0);

        upload_track(&mut scenario, &clock);
        fund_artist_vibe(&mut scenario, BOOST_PLAN_ELITE);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let mut manager = ts::take_shared<CoinManager<VIBE_TOKEN>>(&scenario);
            let vibe = ts::take_from_sender<coin::Coin<VIBE_TOKEN>>(&scenario);

            vibetrax::boost_music(&mut music, &mut treasury, &mut manager, vibe, 2, &clock, ts::ctx(&mut scenario));

            assert!(vibetrax::boost_expiry(&music) == BOOST_DURATION_ELITE_MS, 18);
            ts::return_shared(music);
            ts::return_shared(treasury);
            ts::return_shared(manager);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 16)]
    fun test_boost_invalid_plan_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let mut manager = ts::take_shared<CoinManager<VIBE_TOKEN>>(&scenario);
            let vibe = coin::mint_for_testing<VIBE_TOKEN>(BOOST_PLAN_BASIC, ts::ctx(&mut scenario));

            vibetrax::boost_music(&mut music, &mut treasury, &mut manager, vibe, 9, &clock, ts::ctx(&mut scenario));

            ts::return_shared(music);
            ts::return_shared(treasury);
            ts::return_shared(manager);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 4)]
    fun test_boost_by_non_artist_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);
        fund_artist_vibe(&mut scenario, BOOST_PLAN_BASIC);

        // BUYER tries to boost; must abort because they are not the artist
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let mut treasury = ts::take_shared<VibeTreasury>(&scenario);
            let mut manager = ts::take_shared<CoinManager<VIBE_TOKEN>>(&scenario);
            let vibe = coin::mint_for_testing<VIBE_TOKEN>(BOOST_PLAN_BASIC, ts::ctx(&mut scenario));

            vibetrax::boost_music(&mut music, &mut treasury, &mut manager, vibe, 0, &clock, ts::ctx(&mut scenario));

            ts::return_shared(music);
            ts::return_shared(treasury);
            ts::return_shared(manager);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TOGGLE SALE / UPDATE / DELETE TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_toggle_sale_flips_for_sale_flag() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            assert!(vibetrax::is_for_sale(&music), 19);
            vibetrax::toggle_sale(&mut music, ts::ctx(&mut scenario));
            assert!(!vibetrax::is_for_sale(&music), 20);
            vibetrax::toggle_sale(&mut music, ts::ctx(&mut scenario));
            assert!(vibetrax::is_for_sale(&music), 21);
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 5)]
    fun test_toggle_sale_by_non_owner_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            vibetrax::toggle_sale(&mut music, ts::ctx(&mut scenario)); // BUYER is not current_owner
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_update_music_fields() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            vibetrax::update_music(
                &mut music,
                option::some(ascii::string(b"Updated Title")),
                option::some(ascii::string(b"New description")),
                option::none(), option::none(), option::none(), option::none(),
                ts::ctx(&mut scenario)
            );
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 4)]
    fun test_update_music_by_non_artist_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            vibetrax::update_music(
                &mut music,
                option::some(ascii::string(b"Hack Title")),
                option::none(), option::none(), option::none(), option::none(), option::none(),
                ts::ctx(&mut scenario)
            );
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 1)]
    fun test_update_music_after_sale_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        // Sell the music first
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(10 * NANOS, ts::ctx(&mut scenario));
            vibetrax::purchase_music_nft(&mut music, payment, buyer_user(), ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        // Artist tries to update after first sale — must abort
        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            vibetrax::update_music(
                &mut music,
                option::some(ascii::string(b"Too Late")),
                option::none(), option::none(), option::none(), option::none(), option::none(),
                ts::ctx(&mut scenario)
            );
            ts::return_shared(music);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_delete_music_before_sale() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, ARTIST);
        {
            let music = ts::take_shared<Music>(&scenario);
            vibetrax::delete_music(music, ts::ctx(&mut scenario)); // object consumed and deleted
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // USER PROFILE TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    #[test]
    fun test_register_user_artist() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, ARTIST);
        vibetrax::register_user(
            ascii::string(b"artist"),
            option::some(ascii::string(b"ArtistOne")),
            option::some(ascii::string(b"Music producer from Lagos")),
            option::some(vector[ascii::string(b"Afrobeat"), ascii::string(b"Hip-hop")]),
            ts::ctx(&mut scenario)
        );

        ts::next_tx(&mut scenario, ARTIST);
        {
            let profile = ts::take_from_sender<UserProfile>(&scenario);
            assert!(vibetrax::profile_role(&profile) == ascii::string(b"artist"), 0);
            assert!(vibetrax::profile_owner(&profile) == ARTIST, 1);
            assert!(vibetrax::profile_username(&profile) == option::some(ascii::string(b"ArtistOne")), 2);
            assert!(vibetrax::profile_genres(&profile).length() == 2, 3);
            ts::return_to_sender(&scenario, profile);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_register_user_listener() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, SUBSCRIBER);
        vibetrax::register_user(
            ascii::string(b"listener"),
            option::none(),
            option::none(),
            option::some(vector[ascii::string(b"Jazz")]),
            ts::ctx(&mut scenario)
        );

        ts::next_tx(&mut scenario, SUBSCRIBER);
        {
            let profile = ts::take_from_sender<UserProfile>(&scenario);
            assert!(vibetrax::profile_role(&profile) == ascii::string(b"listener"), 0);
            assert!(vibetrax::profile_username(&profile) == option::none(), 1);
            assert!(vibetrax::profile_bio(&profile) == option::none(), 2);
            ts::return_to_sender(&scenario, profile);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_update_profile() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, ARTIST);
        vibetrax::register_user(
            ascii::string(b"artist"),
            option::none(),
            option::none(),
            option::none(),
            ts::ctx(&mut scenario)
        );

        ts::next_tx(&mut scenario, ARTIST);
        {
            let mut profile = ts::take_from_sender<UserProfile>(&scenario);
            vibetrax::update_profile(
                &mut profile,
                option::some(ascii::string(b"Updated Name")),
                option::some(ascii::string(b"New bio")),
                option::some(vector[ascii::string(b"Rock")]),
                ts::ctx(&mut scenario)
            );
            assert!(vibetrax::profile_username(&profile) == option::some(ascii::string(b"Updated Name")), 0);
            assert!(vibetrax::profile_bio(&profile) == option::some(ascii::string(b"New bio")), 1);
            assert!(vibetrax::profile_genres(&profile).length() == 1, 2);
            ts::return_to_sender(&scenario, profile);
        };

        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 17)]
    fun test_update_profile_unauthorized_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);

        ts::next_tx(&mut scenario, ARTIST);
        vibetrax::register_user(
            ascii::string(b"artist"),
            option::none(),
            option::none(),
            option::none(),
            ts::ctx(&mut scenario)
        );

        // BUYER (sender) takes ARTIST's profile and tries to update it — must abort
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut profile = ts::take_from_address<UserProfile>(&scenario, ARTIST);
            vibetrax::update_profile(
                &mut profile,
                option::some(ascii::string(b"Hacked")),
                option::none(),
                option::none(),
                ts::ctx(&mut scenario)
            );
            ts::return_to_address(ARTIST, profile);
        };

        ts::end(scenario);
    }

    #[test, expected_failure(abort_code = 1)]
    fun test_delete_music_after_sale_fails() {
        let mut scenario = ts::begin(ADMIN);
        setup(&mut scenario);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        upload_track(&mut scenario, &clock);

        ts::next_tx(&mut scenario, BUYER);
        {
            let mut music = ts::take_shared<Music>(&scenario);
            let payment = coin::mint_for_testing<IOTA>(10 * NANOS, ts::ctx(&mut scenario));
            vibetrax::purchase_music_nft(&mut music, payment, buyer_user(), ts::ctx(&mut scenario));
            ts::return_shared(music);
        };

        ts::next_tx(&mut scenario, ARTIST);
        {
            let music = ts::take_shared<Music>(&scenario);
            vibetrax::delete_music(music, ts::ctx(&mut scenario)); // must abort
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
