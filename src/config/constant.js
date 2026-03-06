// ── Runtime constants (used in user-facing transactions) ──────────────────
export const VIBETRAX_PACKAGE_ID =
  "0x6ecf6fb75a5cb2391ed7696292126014780c0ca55983141757165191042a1e4e"; // all function calls
export const VIBETRAX_TREASURY_ID =
  "0x80cf790555f8b8d8ececb8d72d0e83699632885e039c9f2ea1814749ac07922b"; // stream_music, boost_music, pay_stream_reward, register_user
export const VIBETRAX_COIN_MANAGER_ID =
  "0x432f6a57736ce9eadeee95572141c19eaed1a95a6da125df58b95ebb9eaf08c8"; // boost_music, burn

// ── Admin-only objects (not used in frontend transactions) ────────────────
export const VIBETRAX_UPGRADE_CAP_ID =
  "0x226a6b1a51cc2a55a5c7a0a7785d9624b0c23436b545388e00cf82acf231953b"; // future contract upgrades
export const VIBETRAX_PUBLISHER_ID =
  "0x3404725c4b0be596e7df95d48eba5c863092b4792eaa2ba004e0e94d15f1cd44"; // Display management
export const VIBETRAX_DISPLAY_MUSIC_ID =
  "0x6a4d1f5d78abae7f96aa8a93e6ba462b685d2166931a740bc9dfdd968b6fce93"; // Music NFT display template
export const VIBETRAX_METADATA_CAP_ID =
  "0x7d3df08365ec3b3cf494a2fca2e54282f0aa1b49b757e84c929186adc9b6241a"; // update VIBE token metadata
