// ── Runtime constants (used in user-facing transactions) ──────────────────
export const VIBETRAX_PACKAGE_ID =
  "0xe2221f44cbb440ec5c300878f2d686dc1593db21d17739273a712b0b415683a8"; // all function calls
export const VIBETRAX_TREASURY_ID =
  "0x19a2a8aa4f22d01732014fb50e123e05cfb981030a860ad4d3415c157937c2fc"; // stream_music, boost_music, pay_stream_reward, register_user
export const VIBETRAX_COIN_MANAGER_ID =
  "0xca82eb12accc4b4b8dc1141832b5f8d48fe0c1d04e3f0f8e72b325b7572166db"; // boost_music, burn

// ── Admin-only objects (not used in frontend transactions) ────────────────
export const VIBETRAX_UPGRADE_CAP_ID =
  "0xe1200a3d12bece9185d3cba5c50090705247c54a77cfa1b325bac9a1a0117a01"; // future contract upgrades
export const VIBETRAX_PUBLISHER_ID =
  "0x03dbd4b3af1beff7f27af63bf43b20e19e0db7662f24feec19807e30e86464ea "; // Display management
export const VIBETRAX_DISPLAY_MUSIC_ID =
  "0xbc41aa8c10f3d216ec90d6275ea763cb4f1fafc1396852f4455678f03f78cbb2"; // Music NFT display template
export const VIBETRAX_METADATA_CAP_ID =
  "0xce17674af644cd809d19e2b9d697ad53ca94f4444a5b1288a3e572f82aadf099"; // update VIBE token metadata
