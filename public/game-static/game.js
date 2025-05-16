// Game data
const SKINS = {
  default: {
    name: 'Default Duck',
    images: { hungry: 'images/normal/hungry.png', normal: 'images/normal/normal.png', overfed: 'images/normal/overfed.png', dead: 'images/normal/dead.png', fitness: 'images/normal/fitness.png' },
    bonus: { coins: 1, xp: 1, energyRegen: 1 },
    description: 'Standard duck with no bonuses.'
  },
  crypto: {
    name: 'Crypto Duck',
    images: { hungry: 'images/cryptoduck/hungry.png', normal: 'images/cryptoduck/normal.png', overfed: 'images/cryptoduck/overfed.png', dead: 'images/cryptoduck/dead.png', fitness: 'images/cryptoduck/fitness.png' },
    bonus: { coins: 1.15, xp: 1, energyRegen: 1 },
    description: '+15% coins per feed.'
  },
  cyborg: {
    name: 'Cyborg Duck',
    images: { hungry: 'images/cyborg/hungry.png', normal: 'images/cyborg/normal.png', overfed: 'images/cyborg/overfed.png', dead: 'images/cyborg/dead.png', fitness: 'images/cyborg/fitness.png' },
    bonus: { coins: 1, xp: 1.1, energyRegen: 1 },
    description: '+10% XP per feed.'
  },
  silver: {
    name: 'Silver Duck',
    images: { hungry: 'images/silver/hungry.png', normal: 'images/silver/normal.png', overfed: 'images/silver/overfed.png', dead: 'images/silver/dead.png', fitness: 'images/silver/fitness.png' },
    bonus: { coins: 1, xp: 1, energyRegen: 1.15 },
    description: '+15% energy regeneration.'
  },
  pirate: {
    name: 'Pirate Duck',
    images: { hungry: 'images/pirate/hungry.png', normal: 'images/pirate/normal.png', overfed: 'images/pirate/overfed.png', dead: 'images/pirate/dead.png', fitness: 'images/pirate/fitness.png' },
    bonus: { coins: 1.2, xp: 1, energyRegen: 1 },
    description: '+20% coins per feed.'
  },
  wizard: {
    name: 'Wizard Duck',
    images: { hungry: 'images/wizard/hungry.png', normal: 'images/wizard/normal.png', overfed: 'images/wizard/overfed.png', dead: 'images/wizard/dead.png', fitness: 'images/wizard/fitness.png' },
    bonus: { coins: 1, xp: 1.15, energyRegen: 1 },
    description: '+15% XP per feed.'
  }
};

const UPGRADES = [
  { id: 'helmet', name: 'Safety Helmet', icon: '🛡️', baseCost: 50, effect: () => (game.deathChance *= 0.85), description: 'Reduces death chance by 15%.', maxPurchases: 5, level: 1 },
  { id: 'energy-drink', name: 'Energy Drink', icon: '⚡', baseCost: 75, effect: () => (game.energyRegen *= 1.15), description: 'Boosts energy regen by 15%.', maxPurchases: 5, level: 1 },
  { id: 'coin-boost', name: 'Coin Boost', icon: '🪙', baseCost: 100, effect: () => (game.coinsPerFeed *= 1.15), description: 'Increases coins per feed by 15%.', maxPurchases: 5, level: 1 },
  { id: 'xp-boost', name: 'XP Boost', icon: '📈', baseCost: 125, effect: () => (game.xpPerFeed *= 1.15), description: 'Increases XP per feed by 15%.', maxPurchases: 5, level: 2 },
  { id: 'lucky-charm', name: 'Lucky Charm', icon: '🍀', baseCost: 200, effect: () => (game.eventChance += 0.03), description: 'Increases event chance by 3%.', maxPurchases: 5, level: 2 },
  { id: 'gem-detector', name: 'Gem Detector', icon: '💎', baseCost: 300, effect: () => (game.gemChance += 0.015), description: 'Increases gem chance by 1.5%.', maxPurchases: 5, level: 3 },
  { id: 'rubber-duck', name: 'Rubber Duck', icon: '🦢', baseCost: 150, effect: () => (game.coinsPerFeed *= 1.1), description: 'Increases coins per feed by 10%.', maxPurchases: 3, level: 2 },
  { id: 'disco-ball', name: 'Disco Ball', icon: '🪩', baseCost: 250, effect: () => (game.eventChance += 0.015), description: 'Increases event chance by 1.5%.', maxPurchases: 3, level: 3 }
];

const GEM_UPGRADES = [
  { id: 'crypto', name: 'Crypto Duck Skin', icon: '🦆', cost: 10, effect: () => { game.upgrades.push('crypto'); queueNotification('Crypto Duck skin unlocked!'); }, description: 'Unlocks Crypto Duck skin (+15% coins).', repeatable: false },
  { id: 'cyborg', name: 'Cyborg Duck Skin', icon: '🤖', cost: 10, effect: () => { game.upgrades.push('cyborg'); queueNotification('Cyborg Duck skin unlocked!'); }, description: 'Unlocks Cyborg Duck skin (+10% XP).', repeatable: false },
  { id: 'silver', name: 'Silver Duck Skin', icon: '✨', cost: 10, effect: () => { game.upgrades.push('silver'); queueNotification('Silver Duck skin unlocked!'); }, description: 'Unlocks Silver Duck skin (+15% energy regen).', repeatable: false },
  { id: 'pirate', name: 'Pirate Duck Skin', icon: '🏴‍☠️', cost: 15, effect: () => { game.upgrades.push('pirate'); queueNotification('Pirate Duck skin unlocked!'); }, description: 'Unlocks Pirate Duck skin (+20% coins).', repeatable: false },
  { id: 'wizard', name: 'Wizard Duck Skin', icon: '🧙‍♂️', cost: 15, effect: () => { game.upgrades.push('wizard'); queueNotification('Wizard Duck skin unlocked!'); }, description: 'Unlocks Wizard Duck skin (+15% XP).', repeatable: false },
  { id: 'energy-boost', name: 'Full Energy', icon: '⚡', cost: 2, effect: () => (game.energy = 100), description: 'Fully restores energy.', repeatable: true },
  { id: 'xp-buff', name: 'XP Buff (1h)', icon: '📈', cost: 3, effect: () => {
      game.xpBuffStart = Date.now();
      game.xpMultiplier *= 2;
      setTimeout(() => {
        game.xpMultiplier /= 2;
        delete game.xpBuffStart;
        queueNotification('XP Buff ended! 📈');
        updateStats();
      }, 3600000);
    }, description: 'Doubles XP gain for 1 hour.', repeatable: true }
];

const ACHIEVEMENTS = [
  { id: 'feed-50', name: 'Bread Master', icon: '🥖', description: 'Feed the duck 50 times.', condition: () => game.stats.feeds >= 50, progress: () => `${Math.min(game.stats.feeds, 50)}/50 feeds`, reward: { coins: 200, gems: 2 }, secret: false },
  { id: 'level-5', name: 'Rising Star', icon: '📈', description: 'Reach level 5.', condition: () => game.level >= 5, progress: () => `Level ${Math.min(game.level, 5)}/5`, reward: { coins: 500, gems: 3 }, secret: false },
  { id: 'workout-20', name: 'Fitness Guru', icon: '💪', description: 'Complete 20 workouts.', condition: () => game.stats.workouts >= 20, progress: () => `${Math.min(game.stats.workouts, 20)}/20 workouts`, reward: { coins: 300, gems: 2 }, secret: false },
  { id: 'coin-5000', name: 'Coin Tycoon', icon: '🪙', description: 'Collect 5000 coins.', condition: () => game.coins >= 5000, progress: () => `${Math.min(Math.floor(game.coins), 5000)}/5000 coins`, reward: { coins: 1000, gems: 5 }, secret: false },
  { id: 'gardener', name: 'Master Gardener', icon: '🌱', description: 'Harvest 50 plants.', condition: () => game.stats.harvests >= 50, progress: () => `${Math.min(game.stats.harvests, 50)}/50 harvests`, reward: { coins: 800, gems: 4 }, secret: false },
  { id: 'fisher', name: 'Legendary Fisher', icon: '🎣', description: 'Catch 100 fish.', condition: () => game.stats.fishCaught >= 100, progress: () => `${Math.min(game.stats.fishCaught, 100)}/100 fish`, reward: { coins: 1000, gems: 5 }, secret: false }
];

const QUESTS = [
  { id: 'feed-5', name: 'Daily Snack', icon: '🥖', description: 'Feed the duck 5 times today.', condition: () => game.stats.dailyFeeds >= 5, progress: () => `${Math.min(game.stats.dailyFeeds, 5)}/5 feeds`, reward: { coins: 100, gems: 1 }, reset: 'daily' },
  { id: 'workout-2', name: 'Daily Workout', icon: '💪', description: 'Complete 2 workouts today.', condition: () => game.stats.dailyWorkouts >= 2, progress: () => `${Math.min(game.stats.dailyWorkouts, 2)}/2 workouts`, reward: { coins: 150, gems: 1 }, reset: 'daily' },
  { id: 'fish-15', name: 'Fish Hunter', icon: '🎣', description: 'Catch 15 fish today.', condition: () => game.stats.dailyFishCaught >= 15, progress: () => `${Math.min(game.stats.dailyFishCaught, 15)}/15 fish`, reward: { coins: 200, gems: 2 }, reset: 'daily' }
];

const PLANTS = [
  { id: 'bread-flower', name: 'Bread Flower', icon: '🌼', cost: 20, growthTime: 3600000, rewards: { coins: 50, xp: 10, gemChance: 0.01 }, eventChance: 0.15, description: 'Yields 50 coins, 10 XP, 1% gem chance. Growth: 1h' },
  { id: 'coin-bush', name: 'Coin Bush', icon: '🌳', cost: 75, growthTime: 14400000, rewards: { coins: 150, xp: 30, gemChance: 0.05 }, eventChance: 0.2, description: 'Yields 150 coins, 30 XP, 5% gem chance. Growth: 4h' },
  { id: 'star-fruit', name: 'Star Fruit', icon: '🌟', cost: 50, growthTime: 7200000, rewards: { coins: 100, xp: 20, gemChance: 0.03 }, eventChance: 0.18, description: 'Yields 100 coins, 20 XP, 3% gem chance. Growth: 2h' },
  { id: 'gem-vine', name: 'Gem Vine', icon: '🍇', cost: 150, growthTime: 28800000, rewards: { coins: 300, xp: 60, gemChance: 0.1 }, eventChance: 0.25, description: 'Yields 300 coins, 60 XP, 10% gem chance. Growth: 8h' }
];

const PLANT_EVENTS = [
  { text: 'A bird helped your plant grow faster! 🌿', effect: (plant) => { plant.plantedAt -= 1800000; } },
  { text: 'Your plant sparkles with extra rewards! ✨', effect: (plant) => { plant.eventBoost = 1.5; } },
  { text: 'A pest nibbled your plant! 🐛', effect: (plant) => { plant.eventBoost = 0.7; } }
];

const POSITIVE_EVENTS = [
  { trigger: 'feed', text: 'Duck found a shiny coin! 🪩', effect: () => (game.coins += 50) },
  { trigger: 'fitness', text: 'Duck feels stronger! 💪', effect: () => (game.xp += 30) },
  { trigger: 'feed', text: 'Duck discovered Elon\'s lost Dogecoin wallet! 🐕', effect: () => (game.coins += 200) },
  { trigger: 'fitness', text: 'Duck mastered waterbending! 🌊', effect: () => (game.xp += 50) },
  { trigger: 'feed', text: 'Duck found a breadcrumb trail to treasure! 🍞💰', effect: () => (game.coins += 80) },
  { trigger: 'fitness', text: 'Duck did 100 pushups! No sweat! 🦆💦', effect: () => (game.xp += 40) },
  { trigger: 'feed', text: 'Duck got sponsored by OnlyFins! 🤑', effect: () => (game.coins += 120) },
  { trigger: 'fitness', text: 'Duck evolved into Chad Duck! 🦆➡️🏋️', effect: () => (game.xp += 60) },
  { trigger: 'feed', text: 'Duck found a crypto airdrop in the pond! ✈️', effect: () => (game.coins += 150) },
  { trigger: 'fitness', text: 'Duck unlocked Ultra Instinct! 🌀', effect: () => (game.xp += 70) },
  { trigger: 'feed', text: 'Duck sold an NFT of its footprint! 🖼️', effect: () => (game.coins += 300) },
  { trigger: 'fitness', text: 'Duck completed Duck Souls III! 🎮', effect: () => (game.xp += 55) },
  { trigger: 'feed', text: 'Duck found a golden bread loaf! 🍞🌟', effect: () => (game.coins += 90) },
  { trigger: 'fitness', text: 'Duck joined the Avengers! 🦸', effect: () => (game.xp += 65) },
  { trigger: 'feed', text: 'Duck inherited a pond estate! 🏡', effect: () => (game.coins += 180) },
  { trigger: 'fitness', text: 'Duck bench-pressed a turtle! 🐢', effect: () => (game.xp += 45) },
  { trigger: 'feed', text: 'Duck won Duck Idol! 🎤', effect: () => (game.coins += 110) },
  { trigger: 'fitness', text: 'Duck\'s quack scared away gains goblins! 👹', effect: () => (game.xp += 35) },
  { trigger: 'feed', text: 'Duck found a secret bread level! 🍞🎮', effect: () => (game.coins += 70) },
  { trigger: 'fitness', text: 'Duck discovered the fountain of swole! 💦', effect: () => (game.xp += 75) },
  { trigger: 'feed', text: 'Duck got a cameo in Untitled Goose Game! 🎮', effect: () => (game.coins += 160) },
  { trigger: 'fitness', text: 'Duck achieved 100% duckibility! 🦆', effect: () => (game.xp += 80) },
  { trigger: 'feed', text: 'Duck found a bread mine! ⛏️🍞', effect: () => (game.coins += 140) },
  { trigger: 'fitness', text: 'Duck learned to breakdance! 🕺', effect: () => (game.xp += 25) },
  { trigger: 'feed', text: 'Duck started a bread cult! 👁️🍞', effect: () => (game.coins += 130) },
  { trigger: 'fitness', text: 'Duck became TikTok famous! 📱', effect: () => (game.xp += 50) },
  { trigger: 'feed', text: 'Duck found a coupon for 50% off bread! 🎟️', effect: () => (game.coins += 60) },
  { trigger: 'fitness', text: 'Duck unlocked the secret duck-fu style! 🥋', effect: () => (game.xp += 65) },
  { trigger: 'feed', text: 'Duck won the bread lottery! 🍞🎰', effect: () => (game.coins += 250) },
  { trigger: 'fitness', text: 'Duck meditated and found inner peace! ☯️', effect: () => (game.xp += 40) },
  { trigger: 'feed', text: 'Duck discovered a glitch in the bread matrix! 🍞📟', effect: () => (game.coins += 170) },
  { trigger: 'fitness', text: 'Duck became waterproof! 💧', effect: () => (game.xp += 30) },
  { trigger: 'feed', text: 'Duck found a bread-shaped meteorite! 🌠', effect: () => (game.coins += 190) },
  { trigger: 'fitness', text: 'Duck invented a new swimming stroke! 🏊', effect: () => (game.xp += 55) },
  { trigger: 'feed', text: 'Duck got a bread sponsorship! 📢', effect: () => (game.coins += 100) },
  { trigger: 'fitness', text: 'Duck completed the duck marathon! 🏁', effect: () => (game.xp += 70) },
  { trigger: 'feed', text: 'Duck found a crypto duck-token! 🦆💰', effect: () => (game.coins += 220) },
  { trigger: 'fitness', text: 'Duck\'s feathers became aerodynamic! ✈️', effect: () => (game.xp += 45) },
  { trigger: 'feed', text: 'Duck discovered bread grows on trees here! 🌳🍞', effect: () => (game.coins += 85) },
  { trigger: 'fitness', text: 'Duck became friends with a swan! 🦢', effect: () => (game.xp += 60) },
  { trigger: 'feed', text: 'Duck found the Holy Bread relic! ✝️🍞', effect: () => (game.coins += 210) },
  { trigger: 'fitness', text: 'Duck learned to levitate! 🧘', effect: () => (game.xp += 75) },
  { trigger: 'feed', text: 'Duck got a bread-based tax refund! 💸', effect: () => (game.coins += 95) },
  { trigger: 'fitness', text: 'Duck developed quantum quacking! ⚛️', effect: () => (game.xp += 80) },
  { trigger: 'feed', text: 'Duck found a bread genie! 🧞', effect: () => (game.coins += 230) },
  { trigger: 'fitness', text: 'Duck became ambidextrous! ✌️', effect: () => (game.xp += 50) },
  { trigger: 'feed', text: 'Duck discovered bread is actually cake! 🍰', effect: () => (game.coins += 240) },
  { trigger: 'fitness', text: 'Duck unlocked unlimited stamina! ♾️', effect: () => (game.xp += 90) },
  { trigger: 'feed', text: 'Duck found the recipe for eternal bread! 📜', effect: () => (game.coins += 260) },
  { trigger: 'fitness', text: 'Duck achieved CHIM like Vivec! ☀️', effect: () => (game.xp += 100) }
];

const NEGATIVE_EVENTS = [
  { trigger: 'feed', text: 'Duck ate bad bread! 😷', effect: () => (game.energy -= 10) },
  { trigger: 'fitness', text: 'Duck pulled a muscle! 😣', effect: () => (game.deathChance += 0.03) },
  { trigger: 'feed', text: 'Duck invested in DuckCoin... it crashed! 📉', effect: () => (game.coins -= 100) },
  { trigger: 'fitness', text: 'Duck tried to lift... ego hurt! 🤕', effect: () => (game.xp -= 20) },
  { trigger: 'feed', text: 'Duck got bread-zoned! 💔', effect: () => (game.energy -= 15) },
  { trigger: 'fitness', text: 'Duck got owned by a goose! 🦢', effect: () => (game.deathChance += 0.05) },
  { trigger: 'feed', text: 'Duck fell for a bread phishing scam! 🎣', effect: () => (game.coins -= 80) },
  { trigger: 'fitness', text: 'Duck skipped leg day! 🦵', effect: () => (game.xp -= 15) },
  { trigger: 'feed', text: 'Duck got bread-blocked! 🚫', effect: () => (game.energy -= 20) },
  { trigger: 'fitness', text: 'Duck got addicted to duck TikTok! 📱', effect: () => (game.xp -= 25) },
  { trigger: 'feed', text: 'Duck found out bread was cake! 🎂', effect: () => (game.coins -= 60) },
  { trigger: 'fitness', text: 'Duck got cancelled on DuckTwitter! 🐦', effect: () => (game.deathChance += 0.04) },
  { trigger: 'feed', text: 'Duck got bread-rolled! 🎲', effect: () => (game.energy -= 25) },
  { trigger: 'fitness', text: 'Duck pulled a hamstring quacking! 🦵', effect: () => (game.xp -= 30) },
  { trigger: 'feed', text: 'Duck invested in bread futures... bad timing! ⏳', effect: () => (game.coins -= 120) },
  { trigger: 'fitness', text: 'Duck got out-quacked by a rookie! 🐥', effect: () => (game.xp -= 40) },
  { trigger: 'feed', text: 'Duck got bread-jacked! 🦹', effect: () => (game.coins -= 70) },
  { trigger: 'fitness', text: 'Duck got stuck in a bread loop! 🔄', effect: () => (game.energy -= 30) },
  { trigger: 'feed', text: 'Duck ate gluten-free bread by accident! 🚫🌾', effect: () => (game.energy -= 10) },
  { trigger: 'fitness', text: 'Duck got roasted by Dr. Duck! 🦆🔥', effect: () => (game.xp -= 35) },
  { trigger: 'feed', text: 'Duck got bread-ghosted! 👻', effect: () => (game.energy -= 15) },
  { trigger: 'fitness', text: 'Duck got nerfed in latest patch! 🛠️', effect: () => (game.xp -= 50) },
  { trigger: 'feed', text: 'Duck fell for bread pyramid scheme! 🔺', effect: () => (game.coins -= 150) },
  { trigger: 'fitness', text: 'Duck got duck-punched! 👊', effect: () => (game.deathChance += 0.06) },
  { trigger: 'feed', text: 'Duck got bread-shamed on Instagram! 📸', effect: () => (game.energy -= 20) },
  { trigger: 'fitness', text: 'Duck got stuck in a ducking loop! 🔄', effect: () => (game.xp -= 45) },
  { trigger: 'feed', text: 'Duck discovered bread was stale! 🍞💀', effect: () => (game.coins -= 40) },
  { trigger: 'fitness', text: 'Duck got outswam by a turtle! 🐢', effect: () => (game.xp -= 55) },
  { trigger: 'feed', text: 'Duck got bread-fished! 🎣', effect: () => (game.energy -= 25) },
  { trigger: 'fitness', text: 'Duck got banned from DuckGym! 🚷', effect: () => (game.xp -= 60) },
  { trigger: 'feed', text: 'Duck invested in FTX Bread Token... oops! 💸', effect: () => (game.coins -= 200) },
  { trigger: 'fitness', text: 'Duck got ratioed on DuckTok! ❌', effect: () => (game.deathChance += 0.07) },
  { trigger: 'feed', text: 'Duck got bread-ambushed! 🦹', effect: () => (game.energy -= 35) },
  { trigger: 'fitness', text: 'Duck got outplayed by a pigeon! 🕊️', effect: () => (game.xp -= 70) },
  { trigger: 'feed', text: 'Duck got scammed by a bread bot! 🤖', effect: () => (game.coins -= 90) },
  { trigger: 'fitness', text: 'Duck got stuck in a loading screen! ⌛', effect: () => (game.xp -= 80) },
  { trigger: 'feed', text: 'Duck got bread-catfished! 🐱', effect: () => (game.energy -= 40) },
  { trigger: 'fitness', text: 'Duck got nerfed by devs! 👨‍💻', effect: () => (game.xp -= 90) },
  { trigger: 'feed', text: 'Duck got into a bread cult... bad ending! 👁️', effect: () => (game.coins -= 180) },
  { trigger: 'fitness', text: 'Duck got out-quacked by AI! 🤖', effect: () => (game.deathChance += 0.08) },
  { trigger: 'feed', text: 'Duck got bread-hacked! 💻', effect: () => (game.energy -= 45) },
  { trigger: 'fitness', text: 'Duck got stuck in ducking tutorial! 📖', effect: () => (game.xp -= 100) },
  { trigger: 'feed', text: 'Duck got bread-doxxed! 🕵️', effect: () => (game.coins -= 160) },
  { trigger: 'fitness', text: 'Duck got speedrun exploited! ⏱️', effect: () => (game.xp -= 110) },
  { trigger: 'feed', text: 'Duck got bread-gaslit! 💡', effect: () => (game.energy -= 50) },
  { trigger: 'fitness', text: 'Duck got patched out of meta! 🛠️', effect: () => (game.deathChance += 0.1) },
  { trigger: 'feed', text: 'Duck got bread-nerfed! 📉', effect: () => (game.coins -= 140) },
  { trigger: 'fitness', text: 'Duck got duckrolled! 🎸', effect: () => (game.xp -= 120) },
  { trigger: 'feed', text: 'Duck got bread-crashed! 💥', effect: () => (game.energy -= 55) },
  { trigger: 'fitness', text: 'Duck got stuck in ducking time loop! ⏳', effect: () => (game.deathChance += 0.12) }
];

const EPIC_EVENTS = [
  { trigger: 'feed', text: 'Legendary bread feast! 🎉', effect: () => { game.coins += 150; game.gems += 2; } },
  { trigger: 'feed', text: 'Duck found the Infinity Bread! 🍞💎', effect: () => { game.coins += 500; game.gems += 5; } },
  { trigger: 'fitness', text: 'Duck ascended to Ultra Duckstinct! 🌟', effect: () => { game.xp += 200; game.gems += 3; } },
  { trigger: 'feed', text: 'Duck won the Multiverse Bread Games! 🏆', effect: () => { game.coins += 400; game.gems += 4; } },
  { trigger: 'fitness', text: 'Duck became the Ducktor Strange of gains! 🧙', effect: () => { game.xp += 300; game.gems += 6; } }
];

const CHOICE_EVENTS = [
  {
    trigger: 'feed',
    text: 'Mysterious bread found! Eat it?',
    option1: {
      text: 'Eat',
      success: () => { game.coins += 75; queueNotification('Tasty bread! 🪙'); },
      failure: () => { game.energy -= 15; queueNotification('Bad bread! 😷'); }
    },
    option2: {
      text: 'Ignore',
      success: () => queueNotification('Safe choice!'),
      failure: () => queueNotification('Missed a chance...')
    }
  },
  {
    trigger: 'fitness',
    text: 'Strange duck offers forbidden gains! Accept?',
    option1: {
      text: 'Yes',
      success: () => { game.xp += 100; queueNotification('Gains beyond comprehension! 💪'); },
      failure: () => { game.deathChance += 0.15; queueNotification('The price was too high... 💀'); }
    },
    option2: {
      text: 'No',
      success: () => queueNotification('Wise choice... for now'),
      failure: () => queueNotification('The duck stares judgmentally...')
    }
  },
  {
    trigger: 'feed',
    text: 'Shady duck offers crypto-bread! Invest?',
    option1: {
      text: 'Invest',
      success: () => { game.coins += 200; queueNotification('To the moon! 🚀'); },
      failure: () => { game.coins -= 100; queueNotification('Rug pulled! 📉'); }
    },
    option2: {
      text: 'Decline',
      success: () => queueNotification('Diamond wings! 💎'),
      failure: () => queueNotification('FOMO intensifies...')
    }
  },
  {
    trigger: 'fitness',
    text: 'A duck guru offers enlightenment... Meditate?',
    option1: {
      text: 'Meditate',
      success: () => { game.xp += 80; queueNotification('Inner peace achieved! ☯️'); },
      failure: () => { game.energy -= 25; queueNotification('You fell asleep... 😴'); }
    },
    option2: {
      text: 'Skip',
      success: () => queueNotification('Maybe next time.'),
      failure: () => queueNotification('The guru sighs...')
    }
  },
  {
    trigger: 'feed',
    text: 'A bread UFO appears! Board it? 🛸🍞',
    option1: {
      text: 'Board',
      success: () => { game.coins += 300; queueNotification('Aliens love your bread! 👽'); },
      failure: () => { game.energy -= 40; queueNotification('Probed... again! 🔬'); }
    },
    option2: {
      text: 'Run',
      success: () => queueNotification('Smart move.'),
      failure: () => queueNotification('They took your bread anyway!')
    }
  },
  {
    trigger: 'fitness',
    text: 'A buff goose challenges you! Fight? 🦢💪',
    option1: {
      text: 'Fight',
      success: () => { game.xp += 120; queueNotification('Victory! You are the alpha! 🏆'); },
      failure: () => { game.deathChance += 0.2; queueNotification('The goose won... brutally. 💀'); }
    },
    option2: {
      text: 'Negotiate',
      success: () => queueNotification('Peace treaty signed! ✌️'),
      failure: () => queueNotification('The goose scoffs at diplomacy.')
    }
  },
  {
    trigger: 'feed',
    text: 'A bread cult invites you! Join? 👁️🍞',
    option1: {
      text: 'Join',
      success: () => { game.coins += 150; queueNotification('The bread is truth! 🍞✨'); },
      failure: () => { game.energy -= 30; queueNotification('They took your wallet... 💸'); }
    },
    option2: {
      text: 'Refuse',
      success: () => queueNotification('You avoided the madness.'),
      failure: () => queueNotification('They still took your bread...')
    }
  },
  {
    trigger: 'fitness',
    text: 'A suspicious gym bro offers "supplements"! 💊',
    option1: {
      text: 'Take',
      success: () => { game.xp += 150; queueNotification('Gains overload! 💥'); },
      failure: () => { game.deathChance += 0.25; queueNotification('Your liver hates you... 🏥'); }
    },
    option2: {
      text: 'Decline',
      success: () => queueNotification('Natural gains ftw! 🌿'),
      failure: () => queueNotification('He judges your weak genes.')
    }
  },
  {
    trigger: 'feed',
    text: 'A duck influencer wants a collab! Accept? 📱',
    option1: {
      text: 'Collab',
      success: () => { game.coins += 180; queueNotification('Viral fame! 🌟'); },
      failure: () => { game.energy -= 20; queueNotification('Cancelled for old tweets... 🚫'); }
    },
    option2: {
      text: 'Ignore',
      success: () => queueNotification('You value privacy.'),
      failure: () => queueNotification('They subtweeted you...')
    }
  },
  {
    trigger: 'fitness',
    text: 'A time-traveling duck offers future gains! ⏳',
    option1: {
      text: 'Accept',
      success: () => { game.xp += 200; queueNotification('Future you is JACKED! 🔮'); },
      failure: () => { game.energy -= 50; queueNotification('Time paradox! You aged 10 years... 👴'); }
    },
    option2: {
      text: 'Decline',
      success: () => queueNotification('Stable timeline maintained.'),
      failure: () => queueNotification('Your past self is disappointed.')
    }
  },
  {
    trigger: 'feed',
    text: 'A bread dragon hoards treasure! Steal some? 🐉💰',
    option1: {
      text: 'Steal',
      success: () => { game.coins += 400; queueNotification('Dragon didn’t notice! 🎉'); },
      failure: () => { game.energy -= 60; queueNotification('Dragon breath hurts! 🔥'); }
    },
    option2: {
      text: 'Leave',
      success: () => queueNotification('Smart survival instincts.'),
      failure: () => queueNotification('The dragon took your bread anyway...')
    }
  },
  {
    trigger: 'fitness',
    text: 'A cursed dumbbell whispers... Lift it? 🏋️‍♂️👹',
    option1: {
      text: 'Lift',
      success: () => { game.xp += 250; queueNotification('Unlimited power! ⚡'); },
      failure: () => { game.deathChance += 0.3; queueNotification('It lifted you... into the void. 🌌'); }
    },
    option2: {
      text: 'Avoid',
      success: () => queueNotification('Wise choice.'),
      failure: () => queueNotification('It followed you home...')
    }
  },
  {
    trigger: 'feed',
    text: 'A duck chef offers experimental bread! Try? 👨‍🍳',
    option1: {
      text: 'Try',
      success: () => { game.coins += 220; queueNotification('Michelin-star bread! 🌟'); },
      failure: () => { game.energy -= 35; queueNotification('Food poisoning... 🤢'); }
    },
    option2: {
      text: 'Pass',
      success: () => queueNotification('Classic bread is fine.'),
      failure: () => queueNotification('He calls you basic...')
    }
  },
  {
    trigger: 'fitness',
    text: 'A rogue AI wants to optimize your gains! 🤖',
    option1: {
      text: 'Accept',
      success: () => { game.xp += 180; queueNotification('Peak efficiency! 📊'); },
      failure: () => { game.energy -= 45; queueNotification('It overclocked your heart... 💔'); }
    },
    option2: {
      text: 'Reject',
      success: () => queueNotification('No robot overlords today.'),
      failure: () => queueNotification('It hacked your smart-feeder...')
    }
  },
  {
    trigger: 'feed',
    text: 'A duck pirate found a bread treasure map! 🏴‍☠️',
    option1: {
      text: 'Join',
      success: () => { game.coins += 350; queueNotification('X marks the bread! 🗺️'); },
      failure: () => { game.energy -= 50; queueNotification('Marooned on Bread Island... 🏝️'); }
    },
    option2: {
      text: 'Decline',
      success: () => queueNotification('Piracy is wrong.'),
      failure: () => queueNotification('They stole your snacks anyway!')
    }
  },
  {
    trigger: 'fitness',
    text: 'A ghostly coach offers spectral training! 👻',
    option1: {
      text: 'Train',
      success: () => { game.xp += 160; queueNotification('You transcended limits! 👁️'); },
      failure: () => { game.deathChance += 0.18; queueNotification('Possession side effects... 👹'); }
    },
    option2: {
      text: 'Nope',
      success: () => queueNotification('Ghosts are scary.'),
      failure: () => queueNotification('He haunts your dreams...')
    }
  },
  {
    trigger: 'feed',
    text: 'A duck scientist made BREAD 2.0! Test it? 🧪',
    option1: {
      text: 'Test',
      success: () => { game.coins += 280; queueNotification('Breadvolution! 🚀'); },
      failure: () => { game.energy -= 40; queueNotification('Mutated into bread-duck hybrid! 🦆🍞'); }
    },
    option2: {
      text: 'Refuse',
      success: () => queueNotification('Natural bread is best.'),
      failure: () => queueNotification('He sighs: "Luddite."')
    }
  },
  {
    trigger: 'fitness',
    text: 'A duck monk teaches the Way of the Quack! 🧘',
    option1: {
      text: 'Learn',
      success: () => { game.xp += 140; queueNotification('Enlightenment! ✨'); },
      failure: () => { game.energy -= 30; queueNotification('You fell asleep mid-meditation... 😴'); }
    },
    option2: {
      text: 'Skip',
      success: () => queueNotification('Too zen for you.'),
      failure: () => queueNotification('The monk judges your chaos.')
    }
  },
  {
    trigger: 'feed',
    text: 'A duck mafia offers "bread protection"! 🕴️',
    option1: {
      text: 'Pay',
      success: () => { game.coins -= 100; queueNotification('They "protect" you... 🛡️'); },
      failure: () => { game.energy -= 60; queueNotification('They kneecapped you! 🦵'); }
    },
    option2: {
      text: 'Refuse',
      success: () => queueNotification('You called the cops.'),
      failure: () => queueNotification('They "visited" your pond...')
    }
  },
  {
    trigger: 'fitness',
    text: 'A glitched mirror shows your swole future! 🪙',
    option1: {
      text: 'Stare',
      success: () => { game.xp += 220; queueNotification('You absorbed future gains! 💪'); },
      failure: () => { game.deathChance += 0.22; queueNotification('Reality glitched... you phased out! 🌌'); }
    },
    option2: {
      text: 'Look away',
      success: () => queueNotification('Sanity preserved.'),
      failure: () => queueNotification('It still whispers to you...')
    }
  }
];

// Game state
let game = {
  state: 'hungry',
  stage: 'Baby',
  level: 1,
  xp: 0,
  xpNeeded: 150,
  coins: 200,
  gems: 0,
  energy: 100,
  deathChance: 0.15,
  coinsPerFeed: 20,
  xpPerFeed: 20,
  energyRegen: 100 / 7200,
  fitnessTime: 10,
  fishingAttempts: 5,
  maxFishingAttempts: 5,
  lastFishingReset: Date.now(),
  eventChance: 0.25,
  gemChance: 0.05,
  upgrades: [],
  upgradeCounts: {},
  achievements: [],
  pendingAchievements: [],
  quests: [],
  pendingQuests: [],
  stats: {
    feeds: 0,
    workouts: 0,
    deaths: 0,
    dailyFeeds: 0,
    dailyWorkouts: 0,
    dailyCoins: 0,
    harvests: 0,
    dailyHarvests: 0,
    fishCaught: 0,
    dailyFishCaught: 0,
    lastDay: new Date().toDateString()
  },
  lastUpdate: Date.now(),
  lastHide: 0,
  lastFishing: 0,
  lastTreasureMap: 0,
  fitnessEnd: 0,
  xpMultiplier: 1,
  selectedSkin: 'default',
  tutorialSeen: false,
  tutorialStep: 0,
  freeRevives: 3,
  garden: [],
  soundMuted: false,
  isDarkTheme: false
};


const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


function setupMobileOptimization() {
  if (isMobile) {
 
    document.body.classList.add('mobile-device');
    
   
    document.querySelectorAll('.icon-button, .action-buttons button, .shop-item, .plant-button').forEach(element => {
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  }
}
// DOM elements
const DOM = {
  duckImage: document.getElementById('duck-image'),
  stageDisplay: document.getElementById('stage-display'),
  levelDisplay: document.getElementById('level-display'),
  coinsDisplay: document.getElementById('coins-display'),
  gemsDisplay: document.getElementById('gems-display'),
  deathsDisplay: document.getElementById('deaths-display'),
  xpDisplay: document.getElementById('xp-display'),
  xpNeeded: document.getElementById('xp-needed'),
  energyDisplay: document.getElementById('energy-display'),
  xpBar: document.getElementById('xp-bar-fill'),
  energyBar: document.getElementById('energy-bar-fill'),
  feedButton: document.getElementById('feed-button'),
  fitnessButton: document.getElementById('fitness-button'),
  minigamesButton: document.getElementById('minigames-button'),
  reviveButton: document.getElementById('revive-button'),
  buyDuckButton: document.getElementById('buy-duck-button'),
  modal: document.getElementById('modal'),
  modalContent: document.getElementById('modal-content'),
  coinUpgradesContent: document.getElementById('coin-upgrades-content'),
  gemsSkinsContent: document.getElementById('gems-skins-content'),
  achievementsList: document.getElementById('achievements-content'),
  questsList: document.getElementById('quests-content'),
  helpButton: document.getElementById('help-button'),
  gameContainer: document.getElementById('game-container'),
  minigamesMenu: document.getElementById('minigames-menu'),
  hideButton: document.getElementById('hide-button'),
  fishingButton: document.getElementById('fishing-button'),
  treasureMapButton: document.getElementById('treasure-map-button'),
  closeMinigamesButton: document.getElementById('close-minigames'),
  hideGameBox: document.getElementById('hide-game-box'),
  fishingGameBox: document.getElementById('fishing-game-box'),
  treasureMapBox: document.getElementById('treasure-map-box'),
  plantButtons: document.querySelectorAll('.plant-button'),
  gardenStatus: document.getElementById('garden-status'),
  notificationCenter: document.getElementById('notification-center'),
  muteButton: document.getElementById('mute-button'),
  themeButton: document.getElementById('theme-button'),
  backButtons: document.querySelectorAll('.back-button')
};

// Audio setup
const backgroundMusic = new Audio('audio/musicgame.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// Fix background music not playing on start
function playBackgroundMusic() {
  if (!game.soundMuted) {
    backgroundMusic.play().catch(e => console.warn('Failed to play background music:', e));
  }
}

// Update toggleSound to properly handle play/pause
function toggleSound() {
  game.soundMuted = !game.soundMuted;
  DOM.muteButton.textContent = game.soundMuted ? '🔇' : '🔊';
  DOM.muteButton.setAttribute('aria-label', game.soundMuted ? 'Unmute sound' : 'Mute sound');
  if (game.soundMuted) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play().catch(e => console.warn('Failed to play background music:', e));
  }
}

// Toggle theme
function toggleTheme() {
  game.isDarkTheme = !game.isDarkTheme;
  document.body.classList.toggle('dark-theme', game.isDarkTheme);
  DOM.themeButton.textContent = game.isDarkTheme ? '☀️' : '🌙';
  DOM.themeButton.setAttribute('aria-label', game.isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme');
}

// Notifications
let notificationQueue = [];
function queueNotification(message) {
  notificationQueue.push(message);
  if (notificationQueue.length === 1) showNextNotification();
}

function showNextNotification() {
  if (!notificationQueue.length || !DOM.notificationCenter) return;
  const entry = document.createElement('div');
  entry.className = 'notification-item';
  entry.textContent = notificationQueue[0];
  DOM.notificationCenter.appendChild(entry);
  setTimeout(() => {
    entry.classList.add('fade-out');
    setTimeout(() => {
      entry.remove();
      notificationQueue.shift();
      showNextNotification();
    }, 300);
  }, 2000);
}

// Events
let eventQueue = [];
function queueEvent(text, option1Text, option1Action, option2Text, option2Action) {
  eventQueue.push({ text, option1Text, option1Action, option2Text, option2Action });
  if (eventQueue.length === 1 && DOM.modal.style.display !== 'flex') showNextEvent();
}

function showNextEvent() {
  if (!eventQueue.length || !DOM.modal || !DOM.modalContent) return;
  const evt = eventQueue[0];

  DOM.modalContent.innerHTML = '';

  const textElement = document.createElement('p');
  textElement.id = 'modal-text';
  textElement.textContent = evt.text;
  DOM.modalContent.appendChild(textElement);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'modal-buttons';

  const option1Button = document.createElement('button');
  option1Button.id = 'modal-option1';
  option1Button.textContent = evt.option1Text;
  option1Button.onclick = () => {
    DOM.modal.classList.add('fade-out');
    setTimeout(() => {
      DOM.modal.style.display = 'none';
      DOM.modal.classList.remove('fade-out');
      evt.option1Action();
      eventQueue.shift();
      showNextEvent();
    }, 300);
  };
  buttonsContainer.appendChild(option1Button);

  if (evt.option2Text) {
    const option2Button = document.createElement('button');
    option2Button.id = 'modal-option2';
    option2Button.textContent = evt.option2Text;
    option2Button.onclick = () => {
      DOM.modal.classList.add('fade-out');
      setTimeout(() => {
        DOM.modal.style.display = 'none';
        DOM.modal.classList.remove('fade-out');
        evt.option2Action();
        eventQueue.shift();
        showNextEvent();
      }, 300);
    };
    buttonsContainer.appendChild(option2Button);
  }

  DOM.modalContent.appendChild(buttonsContainer);
  DOM.modal.style.display = 'flex';
  DOM.modal.classList.add('fade-in');
  setTimeout(() => DOM.modal.classList.remove('fade-in'), 300);
}

function showTutorialStep(index, steps) {
  if (index >= steps.length) {
    DOM.modal.style.display = 'none';
    game.tutorialSeen = true;
    updateStats();
    return;
  }
  const step = steps[index];

  DOM.modalContent.innerHTML = '';

  const textElement = document.createElement('p');
  textElement.id = 'modal-text';
  textElement.textContent = step.text;
  DOM.modalContent.appendChild(textElement);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'modal-buttons';

  if (index < steps.length - 1) {
    const nextButton = document.createElement('button');
    nextButton.id = 'modal-next';
    nextButton.textContent = 'Next';
    nextButton.onclick = () => showTutorialStep(index + 1, steps);
    buttonsContainer.appendChild(nextButton);
  } else {
    const doneButton = document.createElement('button');
    doneButton.id = 'modal-done';
    doneButton.textContent = 'Done';
    doneButton.onclick = () => {
      DOM.modal.classList.add('fade-out');
      setTimeout(() => {
        DOM.modal.style.display = 'none';
        DOM.modal.classList.remove('fade-out');
        game.tutorialSeen = true;
        updateStats();
      }, 300);
    };
    buttonsContainer.appendChild(doneButton);
  }

  const skipButton = document.createElement('button');
  skipButton.id = 'modal-skip';
  skipButton.textContent = 'Skip';
  skipButton.onclick = () => {
    DOM.modal.classList.add('fade-out');
    setTimeout(() => {
      DOM.modal.style.display = 'none';
      DOM.modal.classList.remove('fade-out');
      game.tutorialSeen = true;
      updateStats();
    }, 300);
  };
  buttonsContainer.appendChild(skipButton);

  DOM.modalContent.appendChild(buttonsContainer);
  DOM.modal.style.display = 'flex';
  DOM.modal.classList.add('fade-in');
  setTimeout(() => DOM.modal.classList.remove('fade-in'), 300);
  step.action();
}

// Coin animation
function showCoinAnimation() {
  if (!DOM.gameContainer) return;
  const coin = document.createElement('div');
  coin.className = 'coin-animation';
  coin.textContent = '🪙';
  coin.style.left = `${Math.random() * (DOM.gameContainer.offsetWidth - 15)}px`;
  DOM.gameContainer.appendChild(coin);
  setTimeout(() => coin.remove(), 1000);
}

// Debounce
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Game update
function updateStats() {
  const now = Date.now();
  const delta = (now - game.lastUpdate) / 1000;
  const skinBonus = SKINS[game.selectedSkin]?.bonus || { energyRegen: 1 };
  game.energy = Math.min(100, game.energy + delta * game.energyRegen * skinBonus.energyRegen);
  game.lastUpdate = now;

  if (game.xpBuffStart && now >= game.xpBuffStart + 3600000) {
    game.xpMultiplier /= 2;
    delete game.xpBuffStart;
    queueNotification('XP Buff ended! 📈');
  }

  if (game.fitnessEnd && now >= game.fitnessEnd) {
    game.state = 'hungry';
    game.fitnessEnd = 0;
    if (DOM.fitnessButton) {
      DOM.fitnessButton.textContent = 'Workout 💪';
      DOM.fitnessButton.disabled = false;
    }
    queueNotification('Workout finished! Duck is hungry 🦆');
  }

  if (game.fitnessEnd && DOM.fitnessButton) {
    const timeLeft = Math.ceil((game.fitnessEnd - now) / 1000);
    DOM.fitnessButton.textContent = `Workout 💪 (${timeLeft}s)`;
    DOM.fitnessButton.disabled = true;
  }

  const today = new Date().toDateString();
  if (game.stats.lastDay !== today) {
    game.stats.lastDay = today;
    resetDailyStats();
    game.gems += 2;
    game.coins += 100;
    queueNotification('Daily login bonus: +2 gems, +100 coins! 🎁');
  }

  if (DOM.stageDisplay) DOM.stageDisplay.textContent = game.stage;
  if (DOM.levelDisplay) DOM.levelDisplay.textContent = game.level;
  if (DOM.coinsDisplay) DOM.coinsDisplay.textContent = Math.floor(game.coins);
  if (DOM.gemsDisplay) {
    DOM.gemsDisplay.textContent = game.xpBuffStart
      ? `${game.gems} 💎 (XP Buff: ${Math.floor((3600000 - (now - game.xpBuffStart)) / 60000)}m)`
      : game.gems;
  }
  if (DOM.deathsDisplay) DOM.deathsDisplay.textContent = game.stats.deaths;
  if (DOM.xpDisplay) DOM.xpDisplay.textContent = Math.floor(game.xp);
  if (DOM.xpNeeded) DOM.xpNeeded.textContent = game.xpNeeded;
  if (DOM.energyDisplay) DOM.energyDisplay.textContent = Math.floor(game.energy);
  if (DOM.xpBar) DOM.xpBar.style.width = `${Math.min(100, (game.xp / game.xpNeeded) * 100)}%`;
  if (DOM.energyBar) DOM.energyBar.style.width = `${Math.min(100, game.energy)}%`;

  if (DOM.feedButton) DOM.feedButton.disabled = game.energy < 5 || game.state === 'dead' || game.fitnessEnd;
  if (DOM.fitnessButton) DOM.fitnessButton.disabled = game.state !== 'overfed' || game.energy < 15 || game.fitnessEnd;
  if (DOM.reviveButton) {
    DOM.reviveButton.disabled = game.state !== 'dead' || game.freeRevives <= 0;
    DOM.reviveButton.textContent = `Revive Free (${game.freeRevives})`;
  }
  if (DOM.buyDuckButton) {
    DOM.buyDuckButton.style.display = game.state === 'dead' && game.freeRevives <= 0 ? 'inline' : 'none';
  }

  if (DOM.hideButton) {
    const hideTimeLeft = Math.max(0, (game.lastHide + 180000 - now) / 1000);
    DOM.hideButton.textContent = hideTimeLeft > 0 ? `Find Coin 🌳 (${Math.floor(hideTimeLeft)}s)` : 'Find Coin 🌳';
    DOM.hideButton.disabled = hideTimeLeft > 0 || game.energy < 8 || game.state === 'dead';
  }

  if (DOM.fishingButton) {
    const fishingTimeLeft = Math.max(0, (game.lastFishing + 300000 - now) / 1000);
    DOM.fishingButton.textContent = fishingTimeLeft > 0 ? `Fishing 🎣 (${Math.floor(fishingTimeLeft)}s)` : 'Fishing 🎣';
    DOM.fishingButton.disabled = fishingTimeLeft > 0 || game.energy < 10 || game.state === 'dead' || game.fishingAttempts <= 0;
  }

  if (DOM.treasureMapButton) {
    const treasureMapTimeLeft = Math.max(0, (game.lastTreasureMap + 21600000 - now) / 1000);
    DOM.treasureMapButton.textContent = treasureMapTimeLeft > 0 ? `Treasure Map 🗺️ (${Math.floor(treasureMapTimeLeft / 3600)}h:${Math.floor((treasureMapTimeLeft % 3600) / 60)}m)` : 'Treasure Map 🗺️';
    DOM.treasureMapButton.disabled = treasureMapTimeLeft > 0 || game.energy < 12 || game.state === 'dead';
  }

  updateDuckImage();
  updateShop();
  updateAchievements();
  updateQuests();
}

// Duck image
function updateDuckImage() {
  if (!DOM.duckImage) return;
  const skin = SKINS[game.selectedSkin] || SKINS.default;
  DOM.duckImage.src = skin.images[game.state] || 'images/fallback.png';
  DOM.duckImage.className = game.state;
  DOM.duckImage.alt = `Duck in ${game.state} state`;
}

// Level up
function checkLevelUp() {
  while (game.xp >= game.xpNeeded) {
    game.level++;
    game.xp -= game.xpNeeded;
    game.xpNeeded = Math.round(game.xpNeeded * 1.4);
    queueNotification(`Level up! Now ${game.level} 🎉`);
    if (game.level >= 5 && game.stage === 'Baby') {
      game.stage = 'Adult';
      queueNotification('Duck grew into an Adult! 🦆');
    } else if (game.level >= 10 && game.stage === 'Adult') {
      game.stage = 'Legend';
      queueNotification('Duck became a Legend! 🦆');
    }
  }
}

// Reset daily stats
function resetDailyStats() {
  game.stats.dailyFeeds = 0;
  game.stats.dailyWorkouts = 0;
  game.stats.dailyCoins = 0;
  game.stats.dailyHarvests = 0;
  game.stats.dailyFishCaught = 0;
  game.quests = game.quests.filter(q => !QUESTS.find(quest => quest.id === q && quest.reset === 'daily'));
  game.pendingQuests = [];
  game.fishingAttempts = game.maxFishingAttempts;
  queueNotification('Daily quests and fishing attempts reset! 📜');
}

// Feed duck
function feedDuck() {
  if (game.energy < 5 || game.state === 'dead' || game.fitnessEnd) return;
  game.energy -= 5;
  const skinBonus = SKINS[game.selectedSkin]?.bonus || { coins: 1, xp: 1 };
  let coins = game.coinsPerFeed * skinBonus.coins;
  let xp = game.xpPerFeed * game.xpMultiplier * skinBonus.xp;

  if (game.state === 'overfed') {
    coins *= 1.5;
    xp *= 1.5;
    game.deathChance += 0.05;
    if (Math.random() < game.deathChance) {
      game.state = 'dead';
      game.coins = Math.floor(game.coins * 0.9);
      game.stats.deaths++;
      queueNotification('Duck overate and died! 💀 -10% coins');
      updateStats();
      return;
    }
  }

  game.coins += coins;
  game.xp += xp;
  game.stats.feeds++;
  game.stats.dailyFeeds++;
  game.stats.dailyCoins += coins;

  if (game.state === 'hungry') game.state = 'normal';
  else if (game.state === 'normal') game.state = 'overfed';

  queueNotification(`🪙 +${Math.floor(coins)} coins, 📈 +${Math.floor(xp)} XP`);
  showCoinAnimation();
  checkLevelUp();
  triggerEvent('feed');
  updateStats();
}

// Workout duck
function workoutDuck() {
  if (game.state !== 'overfed' || game.energy < 15 || game.fitnessEnd) return;
  game.energy -= 15;
  game.state = 'fitness';
  game.fitnessEnd = Date.now() + game.fitnessTime * 1000;
  game.deathChance = Math.max(0.05, game.deathChance - 0.03);

  let xp = 25 * game.xpMultiplier;
  game.xp += xp;
  game.stats.workouts++;
  game.stats.dailyWorkouts++;
  queueNotification(`Workout started! 📈 +${xp} XP`);
  DOM.fitnessButton.disabled = true;
  checkLevelUp();
  triggerEvent('fitness');
  updateStats();
}

// Minigames menu
function showMinigamesMenu() {
  if (!DOM.minigamesMenu) return;
  DOM.minigamesMenu.style.display = 'flex';
  DOM.minigamesMenu.classList.add('fade-in');
  setTimeout(() => DOM.minigamesMenu.classList.remove('fade-in'), 300);
}

function hideMinigamesMenu() {
  if (!DOM.minigamesMenu) return;
  DOM.minigamesMenu.classList.add('fade-out');
  setTimeout(() => {
    DOM.minigamesMenu.style.display = 'none';
    DOM.minigamesMenu.classList.remove('fade-out');
  }, 300);
}

// Find coin minigame
function findCoin() {
  if (game.energy < 8 || game.state === 'dead' || Date.now() < game.lastHide + 180000 || !DOM.hideGameBox) return;
  game.energy -= 8;
  game.lastHide = Date.now();
  hideMinigamesMenu();

  DOM.hideGameBox.style.display = 'flex';
  DOM.hideGameBox.innerHTML = `
    <button class="game-box-close" id="hide-game-close" aria-label="Close find coin game">✖</button>
    <h2>Find the Coin</h2>
    <div class="coin-game-container">
      <div class="coin-game-background"></div>
      <div id="bush-container" class="bush-container"></div>
    </div>
  `;

  const bushContainer = DOM.hideGameBox.querySelector('#bush-container');
  if (!bushContainer) return;
  const coinBush = Math.floor(Math.random() * 4);
  const bushes = Array(4).fill('🌳');

  bushes.forEach((bush, index) => {
    const bushElement = document.createElement('div');
    bushElement.className = 'bush';
    bushElement.setAttribute('aria-label', 'Bush to search for coin');
    bushElement.innerHTML = `<span>${bush}</span>`;
    bushElement.onclick = () => {
      const allBushes = bushContainer.querySelectorAll('.bush');
      allBushes.forEach(b => b.style.pointerEvents = 'none');

      bushElement.classList.add(index === coinBush ? 'found' : 'empty');
      bushElement.innerHTML = `<span>${index === coinBush ? '🪙' : '⭕'}</span>`;
      setTimeout(() => {
        DOM.hideGameBox.classList.add('fade-out');
        setTimeout(() => {
          DOM.hideGameBox.style.display = 'none';
          DOM.hideGameBox.classList.remove('fade-out');
          if (index === coinBush) {
            const coinReward = Math.random() < 0.7 ? 75 : 40;
            game.coins += coinReward;
            game.stats.dailyCoins += coinReward;
            if (Math.random() < 0.1) game.gems += 1;
            queueNotification(`🪙 Found ${coinReward} coins! ${game.gems ? '+1 gem' : ''}`);
            showCoinAnimation();
          } else {
            queueNotification('Nothing here... 😢');
          }
          updateStats();
        }, 300);
      }, 800);
    };
    bushContainer.appendChild(bushElement);
  });

  const closeButton = DOM.hideGameBox.querySelector('#hide-game-close');
  if (closeButton) {
    const closeHandler = () => {
      DOM.hideGameBox.classList.add('fade-out');
      setTimeout(() => {
        DOM.hideGameBox.style.display = 'none';
        DOM.hideGameBox.classList.remove('fade-out');
        updateStats();
      }, 300);
      closeButton.removeEventListener('click', closeHandler);
    };
    closeButton.addEventListener('click', closeHandler);
  }
}

// Fishing minigame
function goFishing() {
  if (
    game.energy < 10 ||
    game.state === 'dead' ||
    Date.now() < game.lastFishing + 300000 ||
    game.fishingAttempts <= 0 ||
    !DOM.fishingGameBox ||
    !DOM.gameContainer
  ) {
    return;
  }

  game.energy -= 10;
  game.fishingAttempts--;
  game.lastFishing = Date.now();
  hideMinigamesMenu();

  DOM.fishingGameBox.style.display = 'flex';
  DOM.fishingGameBox.innerHTML = `
    <button class="game-box-close" id="fishing-game-close" aria-label="Close fishing game">✖</button>
    <h2>Fishing 🎣</h2>
    <p>Catches: <span id="fishing-catches">0</span>/5</p>
    <div class="fishing-game-container">
      <div class="fishing-background"></div>
      <div id="fishing-lane" class="fishing-lane">
        <div class="catch-zone"></div>
        <div class="fish-item" id="fish-item"></div>
      </div>
    </div>
    <p class="fishing-info">Click Catch when the item is in the green zone! Ignore trash to skip it.</p>
    <div class="fishing-buttons">
      <button id="fishing-catch-button" class="fishing-button" aria-label="Catch item">Catch 🎣</button>
      <button id="fishing-exit-button" class="fishing-button secondary" aria-label="Exit fishing game">Exit 🚪</button>
    </div>
  `;

  const fishingLane = DOM.fishingGameBox.querySelector('#fishing-lane');
  const fishItem = DOM.fishingGameBox.querySelector('#fish-item');
  const catchButton = DOM.fishingGameBox.querySelector('#fishing-catch-button');
  const exitButton = DOM.fishingGameBox.querySelector('#fishing-exit-button');
  const closeButton = DOM.fishingGameBox.querySelector('#fishing-game-close');
  const catchesDisplay = DOM.fishingGameBox.querySelector('#fishing-catches');

  if (!fishingLane || !fishItem || !catchButton || !exitButton || !closeButton || !catchesDisplay) return;

  let fishCaught = 0;
  let catches = 0;
  let misses = 0;
  let skips = 0;
  const maxCatches = 5;
  const catchLog = [];

  const exitFishing = () => {
    DOM.fishingGameBox.classList.add('fade-out');
    setTimeout(() => {
      DOM.fishingGameBox.style.display = 'none';
      DOM.fishingGameBox.classList.remove('fade-out');
      game.stats.fishCaught += fishCaught;
      game.stats.dailyFishCaught += fishCaught;

      const fishCount = catchLog.filter(log => log.includes('fish')).length;
      const blueFishCount = catchLog.filter(log => log.includes('blue fish')).length;
      const goldenFishCount = catchLog.filter(log => log.includes('golden fish')).length;
      const coinCount = catchLog.filter(log => log.includes('coin')).length;
      const bootCount = catchLog.filter(log => log.includes('boot')).length;
      let report = `🎣 Fishing Report:\nCaught ${fishCaught} fish (${fishCount} fish, ${blueFishCount} blue fish, ${goldenFishCount} golden fish)\nCaught ${coinCount} coin(s)\nMissed ${misses} time(s)\nSkipped ${skips} item(s) (${bootCount} boot(s))`;
      queueNotification(report);
      updateStats();
    }, 300);
  };

  closeButton.addEventListener('click', exitFishing);
  exitButton.addEventListener('click', exitFishing);

  function spawnFish() {
    if (catches >= maxCatches) {
      exitFishing();
      return;
    }

    fishItem.style.animation = 'none';
    fishItem.offsetHeight;
    const itemType = Math.random();
    const isFast = game.level >= 5 && Math.random() < 0.4;
    let item, reward;
    if (itemType < 0.25) { item = '👟'; reward = { type: 'boot', coins: 0, xp: 5 }; }
    else if (itemType < 0.5) { item = '🪙'; reward = { type: 'coin', coins: 60, xp: 0 }; }
    else if (itemType < 0.75) { item = '🐟'; reward = { type: 'fish', coins: 30, xp: 10 }; }
    else if (itemType < 0.9) { item = '🐠'; reward = { type: 'blue-fish', coins: 50, xp: 15 }; }
    else { item = '🐡'; reward = { type: 'golden-fish', coins: 100, xp: 0, gems: 2 }; }

    fishItem.textContent = item;
    fishItem.setAttribute('aria-label', `Fishing item: ${reward.type}`);
    const catchZoneWidth = isFast ? 120 : 100;
    fishingLane.querySelector('.catch-zone').style.width = `${catchZoneWidth}px`;
    fishItem.style.animation = `swim ${isFast ? 1.2 : 1.8}s linear forwards`;

    const catchHandler = () => {
      const fishRect = fishItem.getBoundingClientRect();
      const zoneRect = fishingLane.querySelector('.catch-zone').getBoundingClientRect();
      const catchZone = fishingLane.querySelector('.catch-zone');

      catches++;
      catchesDisplay.textContent = catches;

      if (
        fishRect.left + fishRect.width / 2 >= zoneRect.left &&
        fishRect.left + fishRect.width / 2 <= zoneRect.right
      ) {
        catchZone.classList.add('success');
        setTimeout(() => catchZone.classList.remove('success'), 300);
        if (reward.type === 'fish') {
          fishCaught++;
          queueNotification('Caught a fish! 🐟');
          catchLog.push('fish');
          game.coins += reward.coins;
          game.xp += reward.xp;
        } else if (reward.type === 'blue-fish') {
          fishCaught++;
          queueNotification('Caught a blue fish! 🐠');
          catchLog.push('blue fish');
          game.coins += reward.coins;
          game.xp += reward.xp;
        } else if (reward.type === 'golden-fish') {
          fishCaught++;
          queueNotification('Caught a golden fish! 🐡');
          catchLog.push('golden fish');
          game.coins += reward.coins;
          game.gems += reward.gems;
        } else if (reward.type === 'coin') {
          queueNotification('Caught a coin! 🪙');
          catchLog.push('coin');
          game.coins += reward.coins;
        } else {
          queueNotification('Caught an old boot! 👟');
          catchLog.push('boot');
          game.xp += reward.xp;
        }
        showCoinAnimation();
        checkLevelUp();
      } else {
        catchZone.classList.add('failure');
        setTimeout(() => catchZone.classList.remove('failure'), 300);
        queueNotification('Missed! Try again.');
        catchLog.push('miss');
        misses++;
      }

      catchButton.removeEventListener('click', catchHandler);
      setTimeout(spawnFish, 300);
    };

    catchButton.addEventListener('click', catchHandler);

    fishItem.onanimationend = () => {
      if (reward.type === 'boot') {
        queueNotification('Skipped an old boot! 👟');
        catchLog.push('boot');
        skips++;
      } else {
        queueNotification(`Skipped a ${reward.type}! 😢`);
        catchLog.push(`miss ${reward.type}`);
        misses++;
      }

      catchButton.removeEventListener('click', catchHandler);
      setTimeout(spawnFish, 300);
    };
  }

  spawnFish();
}

// Treasure map minigame
function openTreasureMap() {
  if (game.energy < 12 || game.state === 'dead' || Date.now() < game.lastTreasureMap + 21600000 || !DOM.treasureMapBox) return;
  game.energy -= 12;
  game.lastTreasureMap = Date.now();
  hideMinigamesMenu();

  DOM.treasureMapBox.style.display = 'flex';
  DOM.treasureMapBox.innerHTML = `
    <button class="game-box-close" id="treasure-map-close" aria-label="Close treasure map game">✖</button>
    <h2>Treasure Map</h2>
    <div class="treasure-map-container">
      <div class="treasure-map-background"></div>
      <div id="treasure-map-grid" class="treasure-map-grid"></div>
    </div>
    <button id="upgrade-map-button" aria-label="Upgrade treasure map">Upgrade Map (30 🪙)</button>
  `;

  const grid = DOM.treasureMapBox.querySelector('#treasure-map-grid');
  const upgradeButton = DOM.treasureMapBox.querySelector('#upgrade-map-button');
  const closeButton = DOM.treasureMapBox.querySelector('#treasure-map-close');

  if (!grid || !upgradeButton || !closeButton) return;

  let upgraded = false;
  const cells = Array(16).fill(null).map(() => {
    const type = Math.random();
    if (game.level >= 5 && type < 0.25) return 'trap';
    if (type < 0.35) return 'empty';
    if (type < 0.45 + (upgraded ? 0.15 : 0)) return 'treasure';
    return 'normal';
  });

  let picksLeft = game.level >= 5 ? 6 : 4;

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'treasure-cell';
    cell.innerHTML = '<span>❓</span>';
    cell.setAttribute('aria-label', 'Treasure map cell');
    cell.onclick = () => {
      if (picksLeft <= 0 || cell.classList.contains('revealed')) return;
      cell.classList.add('revealed');
      picksLeft--;
      const type = cells[i];
      if (type === 'normal') {
        const coins = Math.floor(Math.random() * 51) + 20;
        game.coins += coins;
        game.stats.dailyCoins += coins;
        cell.innerHTML = '<span>🪙</span>';
        queueNotification(`🪙 Found ${coins} coins`);
        showCoinAnimation();
      } else if (type === 'treasure') {
        game.coins += 150;
        game.gems += 2;
        cell.innerHTML = '<span>💎</span>';
        queueNotification('💎 Found a treasure! +150 coins, +2 gems');
        showCoinAnimation();
      } else if (type === 'trap') {
        game.energy = Math.max(0, game.energy - 10);
        cell.innerHTML = '<span>💥</span>';
        queueNotification('💥 Hit a trap! -10 energy');
      } else {
        cell.innerHTML = '<span>⭕</span>';
        queueNotification('⭕ Empty cell...');
      }

      if (picksLeft === 0) {
        setTimeout(() => {
          DOM.treasureMapBox.classList.add('fade-out');
          setTimeout(() => {
            DOM.treasureMapBox.style.display = 'none';
            DOM.treasureMapBox.classList.remove('fade-out');
            updateStats();
          }, 300);
        }, 1000);
      }
    };
    grid.appendChild(cell);
  }

  const upgradeHandler = () => {
    if (game.coins >= 30 && !upgraded) {
      game.coins -= 30;
      upgraded = true;
      upgradeButton.disabled = true;
      queueNotification('🗺️ Map upgraded! Higher treasure chance.');
      updateStats();
    }
  };
  upgradeButton.addEventListener('click', upgradeHandler);

  const closeHandler = () => {
    DOM.treasureMapBox.classList.add('fade-out');
    setTimeout(() => {
      DOM.treasureMapBox.style.display = 'none';
      DOM.treasureMapBox.classList.remove('fade-out');
      updateStats();
    }, 300);
    upgradeButton.removeEventListener('click', upgradeHandler);
  };
  closeButton.addEventListener('click', closeHandler);
}

// Garden
function plant(plantId) {
  const plant = PLANTS.find(p => p.id === plantId);
  if (!plant || game.coins < plant.cost || game.garden.length >= 4 || game.state === 'dead') return;
  game.coins -= plant.cost;
  game.garden.push({ id: plant.id, plantedAt: Date.now(), watered: false, eventBoost: 1 });
  queueNotification(`Planted ${plant.name}! ${plant.icon}`);
  updateGarden();
}

function updateGarden() {
  if (!DOM.gardenStatus) return;
  const now = Date.now();
  DOM.gardenStatus.innerHTML = '';
  DOM.plantButtons.forEach(button => {
    const plantId = button.dataset.plant;
    const plant = PLANTS.find(p => p.id === plantId);
    if (!plant) return;
    button.disabled = game.garden.length >= 4 || game.state === 'dead' || game.coins < plant.cost;
    button.innerHTML = `
      <span class="plant-button-title">Plant ${plant.name} (${plant.cost} 🪙)</span>
      <span class="plant-button-description">${plant.description}</span>
      <span class="plant-button-rewards">Rewards: ${plant.rewards.coins} 🪙, ${plant.rewards.xp} XP, ${plant.rewards.gemChance * 100}% 💎</span>
    `;
  });

  const gardenGrid = document.createElement('div');
  gardenGrid.className = 'garden-grid';
  for (let i = 0; i < 4; i++) {
    const slot = document.createElement('div');
    slot.className = 'garden-slot';
    slot.setAttribute('aria-label', `Garden slot ${i + 1}`);
    if (i < game.garden.length) {
      const plant = game.garden[i];
      const plantData = PLANTS.find(p => p.id === plant.id);
      if (!plantData) continue;
      const timeLeft = Math.max(0, plantData.growthTime - (now - plant.plantedAt));

      if (!plant.eventTriggered && Math.random() < plantData.eventChance) {
        const evt = PLANT_EVENTS[Math.floor(Math.random() * PLANT_EVENTS.length)];
        evt.effect(plant);
        queueNotification(evt.text);
        plant.eventTriggered = true;
      }

      slot.innerHTML = `
        <div class="plant-item">
          <div class="plant-status">
            <span class="plant-icon">${plantData.icon}</span>
            <span class="plant-name">${plantData.name}</span>
            <span class="plant-time">${timeLeft > 0 ? `${Math.floor(timeLeft / 3600000)}h:${Math.floor((timeLeft % 3600000) / 60000)}m` : 'Ready!'}</span>
            <span class="plant-rewards">Rewards: ${plantData.rewards.coins} 🪙, ${plantData.rewards.xp} XP, ${plantData.rewards.gemChance * 100}% 💎</span>
          </div>
          <div class="plant-actions">
            ${timeLeft <= 0 ? '<button class="plant-action-button" aria-label="Harvest plant">Harvest</button>' : !plant.watered ? '<button class="plant-action-button" aria-label="Water plant">Water (5 ⚡)</button>' : ''}
          </div>
        </div>
      `;

      if (timeLeft <= 0) {
        const harvestButton = slot.querySelector('.plant-action-button');
        harvestButton.disabled = game.state === 'dead';
        harvestButton.onclick = () => {
          let rewards = { ...plantData.rewards };
          if (Math.random() < 0.15) rewards.coins *= 0.8;
          if (plant.watered) rewards.coins *= 1.3;
          rewards.coins *= plant.eventBoost;
          rewards.xp *= plant.eventBoost;
          game.coins += rewards.coins;
          game.xp += rewards.xp;
          game.stats.harvests++;
          game.stats.dailyHarvests++;
          game.stats.dailyCoins += rewards.coins;
          if (Math.random() < rewards.gemChance) game.gems += 1;
          queueNotification(`Harvested ${plantData.name}! +${Math.floor(rewards.coins)} coins, +${rewards.xp} XP ${plant.watered ? '(+30% watered)' : ''}${rewards.gemChance > 0 && Math.random() < rewards.gemChance ? ', +1 gem' : ''}`);
          showCoinAnimation();
          checkLevelUp();
          game.garden.splice(i, 1);
          updateGarden();
        };
      } else if (!plant.watered) {
        const waterButton = slot.querySelector('.plant-action-button');
        waterButton.disabled = game.state === 'dead' || game.energy < 5;
        waterButton.onclick = () => {
          game.energy -= 5;
          plant.watered = true;
          queueNotification(`Watered ${plantData.name}! +30% rewards 💧`);
          updateGarden();
        };
      }
    } else {
      slot.innerHTML = '<div class="plant-item empty">Empty Slot</div>';
    }
    gardenGrid.appendChild(slot);
  }
  DOM.gardenStatus.appendChild(gardenGrid);
}

// Shop
function updateShop() {
  if (!DOM.coinUpgradesContent || !DOM.gemsSkinsContent) return;

  // Coin upgrades
  DOM.coinUpgradesContent.innerHTML = '';
  const coinStatsDiv = document.createElement('div');
  coinStatsDiv.className = 'shop-stats';
  coinStatsDiv.innerHTML = `
    <span class="stat-item"><span class="icon" aria-hidden="true">🪙</span> ${Math.floor(game.coins)} Coins</span>
    <span class="stat-item"><span class="icon" aria-hidden="true">💎</span> ${game.gems} Gems</span>
  `;
  DOM.coinUpgradesContent.appendChild(coinStatsDiv);

  const upgradesHeader = document.createElement('h3');
  upgradesHeader.textContent = 'Coin Upgrades';
  DOM.coinUpgradesContent.appendChild(upgradesHeader);

  UPGRADES.forEach((upgrade, index) => {
    const count = game.upgradeCounts[upgrade.id] || 0;
    if (count >= upgrade.maxPurchases || game.level < upgrade.level) return;
    const cost = Math.round(upgrade.baseCost * Math.pow(1.4, count));
    const canAfford = game.coins >= cost;

    const div = document.createElement('div');
    div.className = canAfford ? 'can-buy' : 'unavailable';
    div.innerHTML = `
      <div class="item-text">${upgrade.icon} ${upgrade.name} (${count}/${upgrade.maxPurchases})</div>
      <div class="item-description">${upgrade.description}</div>
    `;

    const button = document.createElement('button');
    button.id = `upgrade-btn-${upgrade.id}-${index}`;
    button.className = 'shop-button';
    button.textContent = `Buy (${cost} 🪙)`;
    button.setAttribute('aria-label', `Buy ${upgrade.name} for ${cost} coins`);
    button.disabled = !canAfford;

    button.onclick = () => {
      if (game.coins < cost) {
        queueNotification('Not enough coins! 🪙');
        return;
      }
      game.coins -= cost;
      upgrade.effect();
      game.upgradeCounts[upgrade.id] = (game.upgradeCounts[upgrade.id] || 0) + 1;
      queueNotification(`Purchased ${upgrade.name}! 🎉`);
      updateStats();
    };

    div.appendChild(button);
    DOM.coinUpgradesContent.appendChild(div);
  });

  // Gem upgrades and skins
  DOM.gemsSkinsContent.innerHTML = '';
  const gemsStatsDiv = document.createElement('div');
  gemsStatsDiv.className = 'shop-stats';
  gemsStatsDiv.innerHTML = `
    <span class="stat-item"><span class="icon" aria-hidden="true">🪙</span> ${Math.floor(game.coins)} Coins</span>
    <span class="stat-item"><span class="icon" aria-hidden="true">💎</span> ${game.gems} Gems</span>
  `;
  DOM.gemsSkinsContent.appendChild(gemsStatsDiv);

  const gemsHeader = document.createElement('h3');
  gemsHeader.textContent = 'Gem Boosts & Skins';
  DOM.gemsSkinsContent.appendChild(gemsHeader);

  GEM_UPGRADES.forEach((upgrade, index) => {
    if (!upgrade.repeatable && game.upgrades.includes(upgrade.id)) return;
    const canAfford = game.gems >= upgrade.cost;

    const div = document.createElement('div');
    div.className = canAfford ? 'can-buy' : 'unavailable';
    div.innerHTML = `
      <div class="item-text">${upgrade.icon} ${upgrade.name}</div>
      <div class="item-description">${upgrade.description}</div>
    `;

    const button = document.createElement('button');
    button.id = `gem-btn-${upgrade.id}-${index}`;
    button.className = 'shop-button';
    button.textContent = `Buy (${upgrade.cost} 💎)`;
    button.setAttribute('aria-label', `Buy ${upgrade.name} for ${upgrade.cost} gems`);
    button.disabled = !canAfford;

    button.onclick = () => {
      if (game.gems < upgrade.cost) {
        queueNotification('Not enough gems! 💎');
        return;
      }
      game.gems -= upgrade.cost;
      upgrade.effect();
      queueNotification(`Purchased ${upgrade.name}! 🎉`);
      updateStats();
    };

    div.appendChild(button);
    DOM.gemsSkinsContent.appendChild(div);
  });

  const skinsHeader = document.createElement('h4');
  skinsHeader.textContent = 'Skins';
  DOM.gemsSkinsContent.appendChild(skinsHeader);

  Object.keys(SKINS).forEach((skinId, index) => {
    if (skinId === 'default' || game.upgrades.includes(skinId)) {
      const isSelected = game.selectedSkin === skinId;

      const div = document.createElement('div');
      div.className = isSelected ? 'purchased' : 'can-buy';
      div.innerHTML = `
        <div class="item-text">${SKINS[skinId].name}</div>
        <div class="item-description">${SKINS[skinId].description}</div>
      `;

      const button = document.createElement('button');
      button.id = `skin-btn-${skinId}-${index}`;
      button.className = 'shop-button';
      button.textContent = isSelected ? 'Selected' : 'Select';
      button.setAttribute('aria-label', `Select ${SKINS[skinId].name} skin`);
      button.disabled = isSelected;

      button.onclick = () => {
        if (!isSelected) {
          game.selectedSkin = skinId;
          queueNotification(`Selected ${SKINS[skinId].name}! 🦆`);
          updateStats();
        }
      };

      div.appendChild(button);
      DOM.gemsSkinsContent.appendChild(div);
    }
  });
}

// Achievements
function updateAchievements() {
  if (!DOM.achievementsList) return;
  DOM.achievementsList.innerHTML = '';

  ACHIEVEMENTS.forEach(ach => {
    if (ach.secret && !game.achievements.includes(ach.id) && !game.pendingAchievements.includes(ach.id)) return;
    if (!game.achievements.includes(ach.id) && !game.pendingAchievements.includes(ach.id) && ach.condition()) {
      game.pendingAchievements.push(ach.id);
      queueNotification(`🏆 Achievement unlocked: ${ach.name}!`);
      const tab = document.querySelector('[data-tab="tasks-tab"]');
      if (tab) tab.classList.add('pending');
    }

    const div = document.createElement('div');
    const isCompleted = game.achievements.includes(ach.id);
    const isPending = game.pendingAchievements.includes(ach.id);
    div.className = isCompleted ? 'completed' : isPending ? 'can-claim' : 'incomplete';
    div.innerHTML = `
      <div class="item-text">${ach.icon} ${ach.name}</div>
      <div class="item-description">${ach.description}</div>
      <div class="item-description">${isCompleted ? 'Completed!' : ach.progress()}</div>
      <div class="item-description">Reward: ${ach.reward.coins} 🪙, ${ach.reward.gems} 💎</div>
    `;
    if (isPending) {
      const button = document.createElement('button');
      button.className = 'claim-button';
      button.textContent = 'Claim';
      button.setAttribute('aria-label', `Claim ${ach.name} reward`);
      button.onclick = () => {
        game.coins += ach.reward.coins;
        game.gems += ach.reward.gems;
        game.achievements.push(ach.id);
        game.pendingAchievements = game.pendingAchievements.filter(id => id !== ach.id);
        queueNotification(`🏆 Claimed ${ach.name}! +${ach.reward.coins} coins, +${ach.reward.gems} gems`);
        updateStats();
      };
      div.appendChild(button);
    }
    DOM.achievementsList.appendChild(div);
  });

  const tab = document.querySelector('[data-tab="tasks-tab"]');
  if (tab && game.pendingAchievements.length === 0 && game.pendingQuests.length === 0) {
    tab.classList.remove('pending');
  }
}

// Quests
function updateQuests() {
  if (!DOM.questsList) return;
  DOM.questsList.innerHTML = '';

  QUESTS.forEach(quest => {
    if (!game.quests.includes(quest.id) && !game.pendingQuests.includes(quest.id) && quest.condition()) {
      game.pendingQuests.push(quest.id);
      queueNotification(`📜 Quest completed: ${quest.name}!`);
      const tab = document.querySelector('[data-tab="tasks-tab"]');
      if (tab) tab.classList.add('pending');
    }

    const div = document.createElement('div');
    const isCompleted = game.quests.includes(quest.id);
    const isPending = game.pendingQuests.includes(quest.id);
    div.className = isCompleted ? 'completed' : isPending ? 'can-claim' : 'incomplete';
    div.innerHTML = `
      <div class="item-text">${quest.icon} ${quest.name}</div>
      <div class="item-description">${quest.description}</div>
      <div class="item-description">${isCompleted ? 'Completed!' : quest.progress()}</div>
      <div class="item-description">Reward: ${quest.reward.coins} 🪙, ${quest.reward.gems} 💎</div>
    `;
    if (isPending) {
      const button = document.createElement('button');
      button.className = 'claim-button';
      button.textContent = 'Claim';
      button.setAttribute('aria-label', `Claim ${quest.name} reward`);
      button.onclick = () => {
        game.coins += quest.reward.coins;
        game.gems += quest.reward.gems;
        game.quests.push(quest.id);
        game.pendingQuests = game.pendingQuests.filter(id => id !== quest.id);
        queueNotification(`📜 Claimed ${quest.name}! +${quest.reward.coins} coins, +${quest.reward.gems} gems`);
        updateStats();
      };
      div.appendChild(button);
    }
    DOM.questsList.appendChild(div);
  });

  const tab = document.querySelector('[data-tab="tasks-tab"]');
  if (tab && game.pendingAchievements.length === 0 && game.pendingQuests.length === 0) {
    tab.classList.remove('pending');
  }
}

function triggerEvent(trigger) {
  if (Math.random() < game.eventChance) {
      const weight = Math.random();
      let evt;

      // Helper function to get a random event from an array based on trigger
      const getRandomEvent = (events) => {
          const filteredEvents = events.filter(e => e.trigger === trigger);
          if (filteredEvents.length === 0) return null;
          return filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
      };

      if (weight < 0.5) {
          evt = getRandomEvent(POSITIVE_EVENTS);
          if (evt) queueEvent(evt.text, 'OK', () => { evt.effect(); updateStats(); });
      } else if (weight < 0.8) {
          evt = getRandomEvent(NEGATIVE_EVENTS);
          if (evt) queueEvent(evt.text, 'OK', () => { evt.effect(); updateStats(); });
      } else if (weight < 0.9) {
          evt = getRandomEvent(EPIC_EVENTS);
          if (evt) queueEvent(evt.text, 'OK', () => { evt.effect(); updateStats(); });
      } else {
          evt = getRandomEvent(CHOICE_EVENTS);
          if (evt) {
              queueEvent(
                  evt.text,
                  evt.option1.text,
                  () => {
                      if (Math.random() < 0.7) {
                          evt.option1.success();
                      } else {
                          evt.option1.failure();
                      }
                      updateStats();
                  },
                  evt.option2.text,
                  () => {
                      if (Math.random() < 0.7) {
                          evt.option2.success();
                      } else {
                          evt.option2.failure();
                      }
                      updateStats();
                  }
              );
          }
      }
  }
}

// Revive duck
function reviveDuck() {
  if (game.state !== 'dead' || game.freeRevives <= 0) return;
  game.freeRevives--;
  game.state = 'hungry';
  game.deathChance = 0.15;
  queueNotification('Duck revived for free! 🦆');
  updateStats();
}

// Buy duck
function buyDuck() {
  if (game.state !== 'dead' || game.coins < 75) return;
  game.coins -= 75;
  game.state = 'hungry';
  game.deathChance = 0.15;
  queueNotification('New duck purchased! 🦆');
  updateStats();
}

// Tutorial
function showTutorial() {
  const steps = [
    {
      text: 'Welcome to Life of Duckie! 🦆\nClick "Feed 🥖" to feed your duck and earn coins and XP!',
      action: () => { DOM.feedButton?.focus(); }
    },
    {
      text: 'Check the shop 🛒 to buy upgrades and skins with coins or gems.',
      action: () => { document.querySelector('[data-tab="shop-tab"]')?.click(); }
    },
    {
      text: 'Visit the Tasks tab 🏆 to complete achievements and daily quests for rewards!',
      action: () => { document.querySelector('[data-tab="tasks-tab"]')?.click(); }
    },
    {
      text: 'Grow plants in the Garden tab 🌱 to earn extra coins and XP!',
      action: () => { document.querySelector('[data-tab="garden-tab"]')?.click(); }
    },
    {
      text: 'Play mini-games 🎲 to earn extra rewards. Try them out!',
      action: () => { document.querySelector('[data-tab="main-tab"]')?.click(); DOM.minigamesButton?.focus(); }
    },
    {
      text: "You're all set! Take care of your duck and have fun! 🎉",
      action: () => { game.tutorialSeen = true; updateStats(); }
    }
  ];

  showTutorialStep(game.tutorialStep, steps);
}


// Save game state
function saveGame() {
  // If user is logged in with Farcaster, save to server
  if (window.farcasterIntegration) {
    window.farcasterIntegration.saveGameData();
  } else {
    // Otherwise save locally
    localStorage.setItem('duckieGame', JSON.stringify(game));
  }
}

// Load game state
async function loadGame() {
  // Check if user is logged in with Farcaster
  let isLoggedIn = false;
  if (window.farcasterIntegration) {
    isLoggedIn = await window.farcasterIntegration.checkFarcasterLogin();
  }
  
  if (isLoggedIn) {
    // Load from server
    await window.farcasterIntegration.loadGameData();
  } else {
    // Load from local storage
    const saved = localStorage.getItem('duckieGame');
    if (saved) {
      game = JSON.parse(saved);
      // Ensure compatibility with new properties
      game.lastUpdate = Date.now();
      game.stats = { ...game.stats, lastDay: new Date().toDateString() };
      game.upgradeCounts = game.upgradeCounts || {};
      game.garden = game.garden || [];
      game.freeRevives = game.freeRevives || 3;
      game.fishingAttempts = game.fishingAttempts || game.maxFishingAttempts || 5;
      game.lastFishingReset = game.lastFishingReset || Date.now();
      updateStats();
    }
  }
}

function init() {
  if (!DOM.feedButton || !DOM.modal) {
    console.error('Critical DOM elements missing. Check HTML structure.');
    return;
  }

  // Setup mobile optimization
  setupMobileOptimization();

  // Tab navigation
  document.querySelectorAll('.icon-button[data-tab]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.icon-button').forEach(btn => btn.classList.remove('active'));
      const tabId = button.dataset.tab;
      document.getElementById(tabId).classList.add('active');
      button.classList.add('active');
      if (tabId === 'tasks-tab') {
        document.querySelectorAll('.tasks-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.submenu-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById('achievements-content').classList.add('active');
        document.querySelector('[data-subtab="achievements"]').classList.add('active');
      }
      if (tabId === 'shop-tab') {
        document.querySelectorAll('.shop-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.submenu-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById('coin-upgrades-content').classList.add('active');
        document.querySelector('[data-subtab="coin-upgrades"]').classList.add('active');
      }
      if (tabId === 'garden-tab') {
        updateGarden();
      }
      updateStats();
    });
  });

  // Submenu navigation
  document.querySelectorAll('.submenu-button[data-subtab]').forEach(button => {
    button.addEventListener('click', () => {
      const parentTab = button.closest('.tab').id;
      document.querySelectorAll(`#${parentTab} .tasks-content, #${parentTab} .shop-content`).forEach(content => content.classList.remove('active'));
      document.querySelectorAll(`#${parentTab} .submenu-button`).forEach(btn => btn.classList.remove('active'));
      const subtabId = button.dataset.subtab;
      document.getElementById(`${subtabId}-content`).classList.add('active');
      button.classList.add('active');
      updateStats();
    });
  });

  // Back buttons
  DOM.backButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.icon-button').forEach(btn => btn.classList.remove('active'));
      document.getElementById('main-tab').classList.add('active');
      document.querySelector('[data-tab="main-tab"]').classList.add('active');
      updateStats();
    });
  });

  // Button event listeners
  DOM.feedButton.onclick = debounce(feedDuck, 300);
  DOM.fitnessButton.onclick = debounce(workoutDuck, 300);
  DOM.minigamesButton.onclick = showMinigamesMenu;
  DOM.reviveButton.onclick = reviveDuck;
  DOM.buyDuckButton.onclick = buyDuck;
  DOM.closeMinigamesButton.onclick = hideMinigamesMenu;
  DOM.hideButton.onclick = findCoin;
  DOM.fishingButton.onclick = goFishing;
  DOM.treasureMapButton.onclick = openTreasureMap;
  DOM.helpButton.onclick = showTutorial;
  DOM.muteButton.onclick = toggleSound;
  DOM.themeButton.onclick = toggleTheme;

  // Plant buttons
  DOM.plantButtons.forEach(button => {
    button.onclick = () => plant(button.dataset.plant);
  });

  if (window.farcasterIntegration) {
    window.farcasterIntegration.initFarcasterIntegration();
  }

  // Load saved game state
  loadGame();

  // Show tutorial if not seen
  if (!game.tutorialSeen) {
    showTutorial();
  }
  // Update game state periodically
  setInterval(() => {
    updateStats();
    saveGame();
  }, 1000);

  // Reset fishing attempts daily
  setInterval(() => {
    const now = Date.now();
    if (now - game.lastFishingReset >= 24 * 60 * 60 * 1000) {
      game.fishingAttempts = game.maxFishingAttempts;
      game.lastFishingReset = now;
      queueNotification('Fishing attempts reset! 🎣');
      updateStats();
    }
  }, 60000);

  setTimeout(() => {
    playBackgroundMusic();
  }, 100);
  // Initial update
  updateStats();
}

// Start the game
init();
