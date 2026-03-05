/*
    ====== VIBE TOKEN =====

    VIBE is the native platform token of VibeTrax.
    Total fixed supply: 10,000,000,000 VIBE (10 billion), minted once at deploy.
    No new VIBE can ever be created — the supply cap is enforced on-chain by
    the IOTA CoinManager standard, not just by convention.

    TOKEN ECONOMY:
    ──────────────
    - Earn:  Subscribers earn VIBE by streaming music (stream-to-earn, daily cap).
    - Spend: Tip artists (peer-to-peer), boost music (burned permanently).
    - Trade: List on a DEX for price discovery and exit liquidity.

    WHY CoinManager:
    ────────────────
    The IOTA CoinManager standard wraps TreasuryCap and CoinMetadata into a single
    shared object with extra verifiability for mainnet users and DEX integrators:
      - Max supply enforced on-chain via enforce_maximum_supply() — one-time, irrevocable.
      - Total supply, max supply, and remaining supply can be queried by anyone.
      - Supply and metadata ownership are separate caps — can be renounced independently.
      - renounce_treasury_ownership() can permanently prove no future minting is possible.

    OBJECT LAYOUT AFTER DEPLOY:
    ────────────────────────────
    - CoinManager<VIBE_TOKEN>           — shared, public, queryable by anyone
    - VibeTreasury                      — shared, accessed only by vibetrax.move functions
        .treasury_cap                   — needed to call burn() via CoinManager
        .reward_pool                    — Balance holding all 10B VIBE at launch
    - CoinManagerMetadataCap<VIBE_TOKEN>— transferred to deployer (update icon URL etc.)
*/


// ── VibeTreasury ──────────────────────────────────────────────────────────
    // Shared object that vibetrax.move functions interact with.
    // Holds the CoinManagerTreasuryCap (required for burn) and the reward pool
    // balance (all 10B VIBE pre-minted at deploy, drawn down per stream reward).
    //
    // NOTE: CoinManager<VIBE_TOKEN> is shared separately — it is the public-facing
    // object anyone can query for supply data. VibeTreasury is the private
    // operational object only platform functions touch.

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



        // ── Pay Stream Reward ─────────────────────────────────────────────────────
    // Pulls `amount` VIBE from the pre-minted reward pool and sends to `recipient`.
    // No-op if pool is exhausted — rewards simply stop; no new minting ever occurs.
    // Called from vibetrax::stream_music.

    // ── Burn ──────────────────────────────────────────────────────────────────
    // Destroys VIBE permanently via CoinManager, reducing tracked total supply.
    // Called from vibetrax::boost_music — every boost permanently shrinks supply.
    
     // ── Reward Pool Balance ───────────────────────────────────────────────────
    // Returns VIBE base units still available for stream rewards.
    // When this hits 0, streaming rewards stop.








    /*
    ====== VIBETRAX =====
    VibeTrax is a decentralized music platform built on the 'Iota blockchain',
    1. Enabling upcoming artists to release music 'without upfront capital', 
    2. Collaborate transparently, and earn fair, on-chain revenue. 
    3. Fans can stream, own, and even resell music—creating an ecosystem where everyone is rewarded based on the value they contribute.

    Scenario
    1. Initial upload: Artist set collaborators and their split percentages (e.g {producer: 20%, writer: 20%, marketer: 20%}), The remaining 40% is the artist percentage.
    2. On Resale: Same splitting ({producer: 20%, writer: 20%, marketer: 20%, Artist: 40%}) of the royalty set [say 20%]

    If Royalty = 20%
    If Initial song value = $10

    Initial sale: [{producer: $2, writer: $2, marketer: $2, artist: $4}]

    After song value increases [e.g to $100]
    New Song value = $100

    Royalty value = (20% of $100) = $20
    Resale with collaborator royalty: [{producer: $4, writer: $4, marketer: $4, artist: $8, currentOwner: $80}]
    Resale without collaborator royalty: [{artist: $20, currentOwner: $80}]

    song value increases based on user interactions (Streams and likes)
    Every stream or every like can increase the value of the song by minute quantity (e.g 0.00001)
    And we decide the calculation (Say 20 streams + 50 Likes will cause that increment). And we can make them increase the value independently

    FEATURES:
    1.(DONE) Upload Music (title, description, genre, image, previewAudio, fullAudio, collaborators[{name, role, address, percentage, hasRoyalty}], initialPrice)
    2. (DONE) Purchase Music (Transferring ownership to purchaser, music is considered SOLD, distribution split)
    3. (DONE) Subscription (30 days subscription with IOTA, that allows unlimited streams of fullAudio of all music, earn platform tokens)
    4. (PARTIALY_DONE) Stream(review for non-premium, fullAudio for premium, one stream per account per music, only subscribed users earn token for streaming, value of music increase)
    5. (DONE) Like (one per account, increases value of music)
    6. (DONE) Tip (Just platform Tokens sent to artist)
    7. (DONE) Boost (Artist decide to boost their music with platform tokens. Boost requires you to buy a plan. Every plan has their unique price)
    8. (DONE) Update [add/remove from market, update music details], Delete
    9. Withdraw (smart contract / Frontend)
    10. (DONE) Platform Fee: 1%
    11. Update platform fee (Admin)

    // Security
    1. (DONE) A collaborator cannot be added twice to a song
    2. (DONE) One Stream per account per music (Frontend will call the stream method after 1 minute of listening)
    3. (DONE) One Like per account per music

    // REVENUE
    1. On every claim (balance withdrawal, token withdrawal)
    2. From Subscription

    // Future Plans
    1. Stream-To-Earn (x402) -> Pay as you go. Users pay for streaming themselves (PROPOSED: x402)
    2. Governance ->  Vote on platform decisions (Platform Fee)
    3. Collaborator update will need multisig approval from all collaborators (PROPOSED: Multisig)
    4. Music update will need multisig approval from all collaborators (PROPOSED: Multisig)
    5. Listing VIBE on DEXes (PROPOSED: Listing)
*/