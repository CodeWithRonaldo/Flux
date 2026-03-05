
module vibetrax::vibe_token {
    use iota::coin_manager::{Self, CoinManager, CoinManagerTreasuryCap};
    use iota::balance::{Self, Balance};
    use iota::coin::Coin;
    use iota::url;

    // ── Supply Constant ───────────────────────────────────────────────────────
    // 10,000,000,000 VIBE × 1,000,000 (6 decimals) = 10,000,000,000,000,000 base units.
    const MAX_SUPPLY: u64 = 10_000_000_000_000_000;

    // ── One-Time Witness ──────────────────────────────────────────────────────
    // MUST match the module name in ALL_CAPS with only `drop`.
    public struct VIBE_TOKEN has drop {}

    // ── VibeTreasury ──────────────────────────────────────────────────────────
    // Shared object that vibetrax.move functions interact with.
    // Holds the CoinManagerTreasuryCap (required for burn) and the reward pool
    // balance (all 10B VIBE pre-minted at deploy, drawn down per stream reward).
    //
    // NOTE: CoinManager<VIBE_TOKEN> is shared separately — it is the public-facing
    // object anyone can query for supply data. VibeTreasury is the private
    // operational object only platform functions touch.
    public struct VibeTreasury has key {
        id: UID,
        treasury_cap: CoinManagerTreasuryCap<VIBE_TOKEN>,
        reward_pool: Balance<VIBE_TOKEN>
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    // Runs ONCE at package publish. Creates VIBE via CoinManager so that supply
    // and metadata are publicly verifiable on-chain from day one.
    fun init(witness: VIBE_TOKEN, ctx: &mut TxContext) {
        // coin_manager::create registers the coin type and returns three objects:
        //   treasury_cap — needed to mint/burn, stored in VibeTreasury
        //   metadata_cap — needed to update name/symbol/icon, sent to deployer
        //   manager      — shared publicly; anyone can query supply & metadata
        //
        // ICON URL (IMPORTANT before mainnet):
        //   Currently set to a Google Drive link — temporary placeholder only.
        //   Google Drive links are not permanent or decentralized.
        //   Before mainnet launch:
        //     1. Upload the logo to IPFS (e.g. via Pinata or NFT.Storage)
        //     2. Call coin_manager::update_icon_url() using your CoinManagerMetadataCap
        //        with the IPFS URL: ipfs://<CID> or https://ipfs.io/ipfs/<CID>
        //   You do NOT need to redeploy — the MetadataCap allows updating after deploy.
        let (treasury_cap, metadata_cap, mut manager) = coin_manager::create(
            witness,
            6,
            b"VIBE",
            b"Vibe Token",
            b"VibeTrax platform token. Earn by streaming, spend on tips and boosts.",
            option::some(url::new_unsafe_from_bytes(b"https://drive.google.com/uc?export=view&id=1kuxtdkORt6Bf21PUPKa0Dis77HB1n8lR")),
            ctx
        );

        // Pre-mint the entire 10B supply into the reward pool at genesis.
        // Nothing is ever minted again — this is the one and only mint call.
        let reward_pool = coin_manager::mint_balance(&treasury_cap, &mut manager, MAX_SUPPLY);

        // Enforce the 10B cap on-chain. This is a one-time, irrevocable action.
        // After this: total_supply == maximum_supply, so any future mint attempt
        // aborts at the framework level — no trust in our code required.
        coin_manager::enforce_maximum_supply(&treasury_cap, &mut manager, MAX_SUPPLY);

        // Share CoinManager publicly — wallets, explorers, DEXes can query it.
        transfer::public_share_object(manager);

        // Send metadata cap to deployer so icon URL can be updated before mainnet.
        // Call coin_manager::renounce_metadata_ownership() when metadata is final.
        transfer::public_transfer(metadata_cap, ctx.sender());

        // Wrap treasury cap + reward pool in our shared operational object.
        transfer::share_object(VibeTreasury {
            id: object::new(ctx),
            treasury_cap,
            reward_pool
        });
    }

    // ── Pay Stream Reward ─────────────────────────────────────────────────────
    // Pulls `amount` VIBE from the pre-minted reward pool and sends to `recipient`.
    // No-op if pool is exhausted — rewards simply stop; no new minting ever occurs.
    // Called from vibetrax::stream_music.
    public fun pay_stream_reward(
        treasury: &mut VibeTreasury,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        if (balance::value(&treasury.reward_pool) >= amount) {
            let vibe = iota::coin::from_balance(
                balance::split(&mut treasury.reward_pool, amount),
                ctx
            );
            transfer::public_transfer(vibe, recipient);
        }
    }

    // ── Burn ──────────────────────────────────────────────────────────────────
    // Destroys VIBE permanently via CoinManager, reducing tracked total supply.
    // Called from vibetrax::boost_music — every boost permanently shrinks supply.
    public fun burn(
        treasury: &mut VibeTreasury,
        manager: &mut CoinManager<VIBE_TOKEN>,
        vibe: Coin<VIBE_TOKEN>
    ) {
        coin_manager::burn(&treasury.treasury_cap, manager, vibe);
    }

    // ── Reward Pool Balance ───────────────────────────────────────────────────
    // Returns VIBE base units still available for stream rewards.
    // When this hits 0, streaming rewards stop.
    public fun reward_pool_balance(treasury: &VibeTreasury): u64 {
        balance::value(&treasury.reward_pool)
    }

    // === Test Functions ===
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(VIBE_TOKEN {}, ctx);
    }
}