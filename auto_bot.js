(() => {
  'use strict';

  // 1. ตรวจสอบว่ากำลังติด Breakpoint ใน Scope หรือมี j อยู่หรือไม่
  try {
    if (typeof j !== 'undefined' && j) {
      window.__gameK = j;
      const canvas = document.querySelector('canvas.sr-game-canvas') || document.querySelector('canvas');
      if (typeof getEventListeners === 'function' && canvas) {
        const listener = getEventListeners(canvas)?.pointerdown?.[0]?.listener;
        if (listener) undebug(listener);
      }
      console.log('%c [Spiki Bot] เชื่อมต่อ Game Instance สำเร็จ!', 'color:#00ff88;font-size:16px;font-weight:bold');
    }
  } catch (e) { }

  // 2. ถ้ายังไม่มี Game Instance ให้ตั้งจุด Breakpoint ดักจับให้อัตโนมัติ
  let game = window.__gameK;
  if (!game) {
    const canvas = document.querySelector('canvas.sr-game-canvas') || document.querySelector('canvas');
    if (typeof getEventListeners === 'function' && canvas) {
      const listener = getEventListeners(canvas)?.pointerdown?.[0]?.listener;
      if (listener) {
        debug(listener);
        console.log('%c [Spiki Bot] ตั้งจุดดักจับแล้ว! -> คลิกที่จอมอนสเตอร์ 1 ครั้ง แล้วกดลูกศรขึ้น (↑) + Enter ใน Console เพื่อเริ่มบอททันทีครับ', 'color:#00e5ff;font-size:15px;font-weight:bold');
        return;
      }
    }
    console.error(' ไม่พบ Canvas เกม กรุณาเปิดหน้าเว็บเกมก่อนรันสคริปต์');
    return;
  }

  // 3. พจนานุกรมชื่อมอนสเตอร์ & แมพ (English Translation Dictionary)
  const MONSTER_NAMES = {
    1001: 'Forest Fairy',
    1002: 'Sprout Fairy',
    1003: 'Forest Beastfolk Scout',
    1004: 'Elven Forest Warden',
    1005: 'Wandering Wind Spirit',
    1006: 'Marsh Toad Familiar',
    1007: 'Apprentice Marsh Witch',
    1008: "Moonlight Will-o'-the-Wisp",
    1009: 'Wandering Spirit',
    1010: 'Mist Shadow',
    1011: 'Wailing Ghost',
    1012: 'Dew Fairy',
    1013: 'Sunbloom Fairy',
    1014: 'Forest Beastfolk Trapper',
    1015: 'Leafshed Elf Warden',
    1016: 'Gentle Breeze Spirit',
    1017: 'Mossback Toad',
    1018: 'Waterweed Fairy',
    1019: "Marshfire Will-o'-the-Wisp",
    1020: 'Black Marsh Toad',
    1021: 'Moonshadow Witch',
    1022: "Pale Will-o'-the-Wisp",
    1023: 'Newly Risen Wraith',
    1024: "Ember Will-o'-the-Wisp",
    1025: 'Gaunt Shadow',
    1026: 'Tomb Shadow',
    1027: 'Ash Wraith',
    1028: 'Ashen Wailing Ghost',
    1029: 'Snowflower Fairy',
    1030: 'Frost Bear Beastfolk',
    1031: "Frost Will-o'-the-Wisp",
    1032: 'Ice Spirit',
    1033: 'Snowblind Shadow',
    1034: 'Ember Lizard',
    1035: "Lava Will-o'-the-Wisp",
    1036: 'Cinder Spirit',
    1037: 'Scorched Beastfolk',
    1038: 'Ember Hatchling Dragon',
    1039: 'Dawn Fairy',
    1040: 'Root Golem',
    1041: 'Root-entangled Wraith',
    1042: 'Dawn Warden Spirit',
    1043: 'Dawn Elf Guard',
    1044: 'Dawn Dragonscale Soldier',
    1045: 'Duskwing Fairy',
    1046: 'Thornbush Beastfolk',
    1047: 'Border Elf Scout',
    1048: 'Duskflower Spirit',
    1049: 'Twilight Wolfkin',
    1050: 'Moorland Wind Spirit',
    1051: 'Broken Scout Drone',
    1052: 'Gearblade Harvester',
    1053: 'Sickle Vole Beastfolk',
    1054: "Oil Lamp Will-o'-the-Wisp",
    1055: 'Patrol Drone (Old Model)',
    1056: 'Tow Claw Automaton',
    1057: 'Welding Spark Impbot',
    1058: 'Scrap Press Golem',
    1059: 'Overload Circuit Spirit',
    1060: 'Track Sweeper Bot',
    1061: 'Signal Light Ghost',
    1062: 'Abandoned Minecart Golem',
    1063: 'Cutter Automaton',
    1064: 'Spark Spirit',
    1065: 'Sooty Impbot',
    1066: 'Exhaust Cleaning Drone',
    1067: 'Crimping Press Golem',
    1068: 'Heat-resistant Mole Beastfolk',
    1069: 'Ash Cinder Spirit',
    1070: 'Lightning Strike Spirit',
    1071: 'Power Line Surveillance Drone',
    1072: 'Coil Spider Bot',
    1073: 'Lightning Rod Knight Automaton',
    1074: 'Thundercloud Wyvern',
    1075: 'Core Security Automaton',
    1076: 'Coolant Spraying Drone',
    1077: 'Molten Slime Core',
    1078: 'Surveillance Eye Lens',
    1079: 'Rampaging Electric Spirit',
    1080: 'Hangar Defense Drone (Summoned)',
    1081: 'Rampaging Maintenance Unit (Summoned)',
    2001: 'Young Dragon',
    2002: 'Ancient Wind Spirit',
    2003: 'Dragonscale Guardian',
    2004: 'Moonmist Giant Frog',
    2005: 'Moonlight Phantom Dragon',
    2006: 'Ashen Bone Dragon',
    2007: 'Giant Mist Wraith',
    2008: 'Deepwood Elder Dragon',
    2009: 'Frost Peak Wyvern',
    2010: 'Lava Lord Dragon',
    2011: 'Dawn Tree World Guardian'
  };

  const KR_TO_EN_MONSTERS = {
    '숲의 요정': 'Forest Fairy',
    '새싹 요정': 'Sprout Fairy',
    '숲 수인 정찰병': 'Forest Beastfolk Scout',
    '엘프 숲지기': 'Elven Forest Warden',
    '떠도는 바람정령': 'Wandering Wind Spirit',
    '어린 용': 'Young Dragon',
    '고대 바람정령': 'Ancient Wind Spirit',
    '용린 수호자': 'Dragonscale Guardian',
    '습지 두꺼비 사역마': 'Marsh Toad Familiar',
    '견습 습지마녀': 'Apprentice Marsh Witch',
    '달빛 도깨비불': "Moonlight Will-o'-the-Wisp",
    '대습지 마녀': 'Great Marsh Witch',
    '떠도는 망령': 'Wandering Spirit',
    '안개 그림자': 'Mist Shadow',
    '곡성 유령': 'Wailing Ghost',
    '무덤지기 대망령': 'Great Gravekeeper Spirit',
    '이슬 요정': 'Dew Fairy',
    '볕꽃 요정': 'Sunbloom Fairy',
    '숲 수인 덫사냥꾼': 'Forest Beastfolk Trapper',
    '잎갈이 엘프 파수꾼': 'Leafshed Elf Warden',
    '산들 바람정령': 'Gentle Breeze Spirit',
    '이끼등 두꺼비': 'Mossback Toad',
    '물풀 요정': 'Waterweed Fairy',
    '늪불 도깨비불': "Marshfire Will-o'-the-Wisp",
    '검은늪 두꺼비': 'Black Marsh Toad',
    '달그림자 마녀': 'Moonshadow Witch',
    '창백한 도깨비불': "Pale Will-o'-the-Wisp",
    '늪지 마녀 견습장': 'Marsh Witch Preceptor',
    '갓 깨어난 망령': 'Newly Risen Wraith',
    '잿불 도깨비불': "Ember Will-o'-the-Wisp",
    '여윈 그림자': 'Gaunt Shadow',
    '무덤 그림자': 'Tomb Shadow',
    '잿망령': 'Ash Wraith',
    '잿빛 곡성 유령': 'Ashen Wailing Ghost',
    '묘지기 석상망령': 'Gravekeeper Statue Wraith',
    '눈꽃 요정': 'Snowflower Fairy',
    '서리 곰 수인': 'Frost Bear Beastfolk',
    '서리 도깨비불': "Frost Will-o'-the-Wisp",
    '얼음 정령': 'Ice Spirit',
    '설맹 그림자': 'Snowblind Shadow',
    '서리별 고대정령': 'Frost-star Ancient Spirit',
    '잉걸 도마뱀': 'Ember Lizard',
    '용암 도깨비불': "Lava Will-o'-the-Wisp",
    '잿불 정령': 'Cinder Spirit',
    '화상 수인': 'Scorched Beastfolk',
    '잉걸 새끼용': 'Ember Hatchling Dragon',
    '잉걸 용린 폭군': 'Ember Dragonscale Tyrant',
    '여명 요정': 'Dawn Fairy',
    '뿌리 골렘': 'Root Golem',
    '뿌리 얽힌 망령': 'Root-entangled Wraith',
    '여명 파수정령': 'Dawn Warden Spirit',
    '여명 엘프 수호병': 'Dawn Elf Guard',
    '여명 용린병': 'Dawn Dragonscale Soldier',
    '여명빛 파수꾼': 'Dawnlight Guardian',
    '노을나비 요정': 'Duskwing Fairy',
    '가시덤불 수인': 'Thornbush Beastfolk',
    '국경 엘프 척후': 'Border Elf Scout',
    '노을꽃 정령': 'Duskflower Spirit',
    '어스름 늑대수인': 'Twilight Wolfkin',
    '들판 바람정령': 'Moorland Wind Spirit',
    '고장난 정찰 드론': 'Broken Scout Drone',
    '톱니날 수확기': 'Gearblade Harvester',
    '낫 들쥐수인': 'Sickle Vole Beastfolk',
    '기름등 도깨비불': "Oil Lamp Will-o'-the-Wisp",
    '순찰 드론 (구형)': 'Patrol Drone (Old Model)',
    '견인 집게 오토마타': 'Tow Claw Automaton',
    '용접불꽃 임프봇': 'Welding Spark Impbot',
    '고철 압축 골렘': 'Scrap Press Golem',
    '과부하 배전정령': 'Overload Circuit Spirit',
    '선로 청소봇': 'Track Sweeper Bot',
    '신호등 유령': 'Signal Light Ghost',
    '폐선 광차 골렘': 'Abandoned Minecart Golem',
    '절단기 오토마타': 'Cutter Automaton',
    '스파크 정령': 'Spark Spirit',
    '그을음 임프봇': 'Sooty Impbot',
    '배기 청소 드론': 'Exhaust Cleaning Drone',
    '압착 프레스 골렘': 'Crimping Press Golem',
    '내열복 두더지수인': 'Heat-resistant Mole Beastfolk',
    '재먼지 정령': 'Ash Cinder Spirit',
    '낙뢰 정령': 'Lightning Strike Spirit',
    '송전 감시 드론': 'Power Line Surveillance Drone',
    '코일 거미봇': 'Coil Spider Bot',
    '피뢰기사 오토마타': 'Lightning Rod Knight Automaton',
    '뇌운 와이번': 'Thundercloud Wyvern',
    '코어 경비 오토마타': 'Core Security Automaton',
    '냉각 살포 드론': 'Coolant Spraying Drone',
    '용융 슬라임 코어': 'Molten Slime Core',
    '감시안 렌즈': 'Surveillance Eye Lens',
    '폭주 전력정령': 'Rampaging Electric Spirit',
    '격납고 방어 드론': 'Hangar Defense Drone (Summoned)',
    '폭주 정비 유닛': 'Rampaging Maintenance Unit (Summoned)',
    '녹슨 파수 기간트': 'Rusted Watch Gigant',
    '공업지대 감독 오토마타': 'Factory Overseer Automaton',
    '폐선 기관장 유령': 'Railway Conductor Ghost',
    '용광로 코어 골렘': 'Furnace Core Golem',
    '번개철탑 수호기': 'Thunder Pylon Guardian',
    '심부 감시 관제탑': 'Core Watchtower',
    '봉인된 시작형 기간트': 'Sealed Prototype Gigant',
    '폭주하는 동력핵': 'Runaway Power Core'
  };

  const ZONE_LIST = [
    { id: 0, name: '📍 Current Map Only' },
    { id: 1, name: '🏛️ World Tree Temple (Town)' },
    { id: 2, name: '🌲 Sunbreeze Forest (Lv.1 - 10)' },
    { id: 5, name: '🌳 Sunbough Deepwood (Lv.10 - 20)' },
    { id: 3, name: '🌿 Moonmist Marsh (Lv.20 - 30)' },
    { id: 6, name: '🌙 Moonring Marshdell (Lv.30 - 40)' },
    { id: 4, name: '🪦 Ashen Mist Graveyard (Lv.40 - 50)' },
    { id: 7, name: '⛰️ Ashshade Tomb Hill (Lv.50 - 60)' },
    { id: 8, name: '❄️ Frostreach Snow Hills (Lv.60 - 70)' },
    { id: 9, name: '🔥 Emberfall Lava Cavern (Lv.70 - 80)' },
    { id: 10, name: '✨ Dawnlight Root Hollow (Lv.80+)' }
  ];

  // ลำดับการเชื่อมต่อของแผนที่โลกจริงในเกม (True World Map Graph Progression)
  const WORLD_MAP_PATH = [1, 2, 5, 3, 6, 4, 7, 8, 9, 10];

  // 4. เริ่มต้นระบบ Spiki Bot
  if (window.__spikiBotInstance) {
    window.__spikiBotInstance.destroy();
  }

  const bot = {
    game,
    running: true,
    loopTimer: null,
    lastSkillCastTime: 0,
    lastBasicAttackTime: 0,
    lastRespawnTime: 0,
    lastPotionTime: 0,
    lastPortalAttemptTime: 0,
    lastTickTime: performance.now(),
    discoveredMonsters: new Map(),
    goToTarget: null,

    config: {
      checkIntervalMs: 40,
      maxSearchDistance: 120,
      attackRangeM: 2.2,
      walkSpeed: 3.5,

      targetZoneId: 0,
      targetMonsterFilter: 'ALL',
      levelFilterMode: 'ALL',
      autoProgressMap: false,
      useFarmCenter: false,
      farmCenter: null,
      farmRadius: 40,

      autoHeal: true,
      healThresholdPercent: 65,
      autoRevive: true,
      autoDodge: true,
      autoWalkToGate: false,
      useSkills: true,
    },

    getRecommendedZoneForLevel(level) {
      if (level < 10) return 2; // Sunbreeze Forest (Lv.1 - 10)
      if (level < 20) return 5; // Sunbough Deepwood (Lv.10 - 20)
      if (level < 30) return 3; // Moonmist Marsh (Lv.20 - 30)
      if (level < 40) return 6; // Moonring Marshdell (Lv.30 - 40)
      if (level < 50) return 4; // Ashen Mist Graveyard (Lv.40 - 50)
      if (level < 60) return 7; // Ashshade Tomb Hill (Lv.50 - 60)
      if (level < 70) return 8; // Frostreach Snow Hills (Lv.60 - 70)
      if (level < 80) return 9; // Emberfall Lava Cavern (Lv.70 - 80)
      return 10; // Dawnlight Root Hollow (Lv.80+)
    },

    getCurrentZoneId() {
      return this.game.visualZoneId ?? this.game.zoneId ?? 1;
    },

    isInTown() {
      return this.getCurrentZoneId() === 1;
    },

    getPlayerPosition() {
      return this.game.playerContainer?.position || null;
    },

    getPlayerHpInfo() {
      const hp = this.game.myStat?.hp ?? 0;
      const maxHp = this.game.myStat?.maxHp ?? 1;
      const percent = maxHp > 0 ? (hp / maxHp) * 100 : 100;
      return { hp, maxHp, percent };
    },

    getMonsterFormattedName(info) {
      if (!info) return 'Monster';
      let enName = null;
      if (info.monsterMasterId && MONSTER_NAMES[info.monsterMasterId]) {
        enName = MONSTER_NAMES[info.monsterMasterId];
      }
      if (!enName && info.name && KR_TO_EN_MONSTERS[info.name]) {
        enName = KR_TO_EN_MONSTERS[info.name];
      }
      if (!enName && info.name) {
        enName = MONSTER_NAMES[info.name] || info.name;
      }
      enName = enName || 'Monster';
      const lvl = info.level ? ` [Lv.${info.level}]` : '';
      return `${enName}${lvl}`;
    },

    tryUsePotion() {
      const now = performance.now();
      if (now - this.lastPotionTime < 1000) return false;

      if (this.game.potionSlot && typeof this.game.potionSlot.getRemainingCooldownMs === 'function') {
        if (this.game.potionSlot.getRemainingCooldownMs() > 0) return false;
      }

      try {
        if (typeof this.game.tryUsePotion === 'function') {
          this.game.tryUsePotion();
          this.lastPotionTime = now;
          return true;
        }
      } catch (e) { }
      return false;
    },

    handleAutoDodge(playerPos, dtSec) {
      if (!this.config.autoDodge) return false;
      const decals = this.game.telegraphDecals?.decals;
      if (!decals || decals.length === 0) return false;

      for (const decal of decals) {
        if (!decal?.group?.position) continue;
        const cx = decal.group.position.x;
        const cz = decal.group.position.z;
        const dx = playerPos.x - cx;
        const dz = playerPos.z - cz;
        const dist = Math.hypot(dx, dz);
        const dangerRadius = (decal.param1 || 5.0) + 1.2;

        if (dist < dangerRadius) {
          let escapeX, escapeZ;
          if (dist < 0.2) {
            escapeX = cx + dangerRadius + 1.0;
            escapeZ = cz;
          } else {
            escapeX = cx + (dx / dist) * (dangerRadius + 1.5);
            escapeZ = cz + (dz / dist) * (dangerRadius + 1.5);
          }
          this.walkTowards(escapeX, escapeZ, dtSec);
          this.updateUIStatus(`[Dodge] กำลังหลบวงสกิลมอนสเตอร์! (${(dangerRadius - dist).toFixed(1)}m ถึงพ้นวง)...`);
          return true;
        }
      }
      return false;
    },

    getTarget() {
      const id = this.game.targetMonsterId;
      if (id === null || id === undefined) return null;
      const monster = this.game.monsters?.get ? this.game.monsters.get(id) : null;
      if (!monster) return null;
      return {
        id,
        name: this.getMonsterFormattedName(monster.info),
        rawName: monster.info?.name,
        hp: monster.info?.currentHp ?? 0,
        maxHp: monster.info?.maxHp ?? 1,
        raw: monster
      };
    },

    getNearestMonster() {
      const playerPos = this.getPlayerPosition();
      if (!playerPos) return null;
      const monsterMap = this.game.monsters?.monsters || this.game.monsters;
      if (!monsterMap) return null;
      const monstersList = typeof monsterMap.values === 'function' ? [...monsterMap.values()] : Object.values(monsterMap);

      let nearest = null;
      let minDistance = this.config.maxSearchDistance;
      let newMonsterFound = false;

      for (const m of monstersList) {
        const info = m.info;
        const pos = m.container?.position;
        if (!info || !pos || (info.currentHp !== undefined && info.currentHp <= 0)) continue;

        const formattedName = this.getMonsterFormattedName(info);

        if (!this.discoveredMonsters.has(info.name)) {
          this.discoveredMonsters.set(info.name, formattedName);
          newMonsterFound = true;
        }

        // Filter by selected monster
        if (this.config.targetMonsterFilter !== 'ALL') {
          const filter = this.config.targetMonsterFilter;
          if (info.name !== filter && formattedName !== filter) {
            continue;
          }
        }

        // Filter by monster level relative to player level (Max +3 levels difference)
        const playerLevel = this.game.myStat?.level || 1;
        const monsterLevel = info.level || 1;
        if (this.config.levelFilterMode === 'GTE' && (monsterLevel < playerLevel || monsterLevel > playerLevel + 3)) {
          continue;
        }
        if (this.config.levelFilterMode === 'GT' && (monsterLevel <= playerLevel || monsterLevel > playerLevel + 3)) {
          continue;
        }
        if (this.config.levelFilterMode === 'EQ' && monsterLevel !== playerLevel) {
          continue;
        }

        // Filter by farm radius
        if (this.config.useFarmCenter && this.config.farmCenter) {
          const distFromCenter = Math.hypot(pos.x - this.config.farmCenter.x, pos.z - this.config.farmCenter.z);
          if (distFromCenter > this.config.farmRadius) {
            continue;
          }
        }

        const dx = pos.x - playerPos.x;
        const dz = pos.z - playerPos.z;
        const dist = Math.hypot(dx, dz);

        if (dist < minDistance) {
          minDistance = dist;
          nearest = {
            id: info.monsterInstanceId,
            name: formattedName,
            rawName: info.name,
            hp: info.currentHp,
            maxHp: info.maxHp,
            distance: dist,
            position: pos
          };
        }
      }

      if (newMonsterFound) {
        this.updateMonsterDropdown();
      }

      return nearest;
    },

    getCurrentZonePortals() {
      try {
        const frame = this.game.buildMinimapFrame ? this.game.buildMinimapFrame() : null;
        if (frame?.portals && frame.portals.length > 0) {
          return frame.portals;
        }
      } catch (e) { }
      return [];
    },

    walkTowards(targetX, targetZ, dtSec) {
      const player = this.game.playerContainer;
      if (!player?.position) return 0;

      const dx = targetX - player.position.x;
      const dz = targetZ - player.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist <= 0.1) {
        if (this.game.localAnimationController?.setLocomotion) {
          this.game.localAnimationController.setLocomotion(false);
        }
        return dist;
      }

      const targetYaw = Math.atan2(dx, dz);
      player.rotation.y = targetYaw;

      const step = Math.min(dist, this.config.walkSpeed * dtSec);
      const moveX = (dx / dist) * step;
      const moveZ = (dz / dist) * step;

      player.position.x += moveX;
      player.position.z += moveZ;

      if (this.game.localAnimationController?.setLocomotion) {
        this.game.localAnimationController.setLocomotion(true);
      }

      if (this.game.socket?.sendMove) {
        this.game.socket.sendMove(1, player.position.x, 0, player.position.z, targetYaw);
      }

      return dist;
    },

    setTarget(id) {
      try {
        if (typeof this.game.setTarget === 'function') {
          this.game.setTarget(id);
          return true;
        }
      } catch (e) { }
      return false;
    },

    // Direct Attack Engine
    directAttack(targetId) {
      if (targetId == null) return;
      const now = performance.now();
      if (now - this.lastBasicAttackTime < 400) return;

      this.lastBasicAttackTime = now;
      this.game.skillRequestInFlight = false;

      try {
        if (this.game.socket?.sendUseSkill) {
          this.game.socket.sendUseSkill(targetId, 1);
        } else if (typeof this.game.trySkill === 'function') {
          this.game.trySkill(1);
        }
      } catch (e) { }
    },

    skillCastIndex: 0,

    directCastSkill(skillId, targetId) {
      if (targetId == null) return false;
      this.game.skillRequestInFlight = false;

      try {
        if (this.game.socket?.sendUseSkill) {
          this.game.socket.sendUseSkill(targetId, skillId);
          return true;
        } else if (typeof this.game.trySkill === 'function') {
          return this.game.trySkill(skillId);
        }
      } catch (e) { }
      return false;
    },

    getReadySkills() {
      const hotbar = this.game.skillHotbar;
      if (!hotbar?.slots) return [];
      const pLevel = this.game.myStat?.level || 1;
      const ready = [];
      for (const slot of hotbar.slots) {
        if (!slot || slot.skillId == null || slot.skillId === 1) continue;
        if (slot.requiredLevel && pLevel < slot.requiredLevel) continue;

        let cd = 0;
        if (typeof hotbar.getRemainingCooldownMs === 'function') {
          cd = hotbar.getRemainingCooldownMs(slot.skillId);
        } else if (slot.cooldownEndAt) {
          cd = Math.max(0, slot.cooldownEndAt - performance.now());
        }

        if (cd <= 0) {
          ready.push(slot);
        }
      }
      return ready;
    },

    lastKnownZone: null,

    // ระบบนำทางข้ามประตูมิติ (Clean Portal Router - Zero Delay)
    handleMapTravel(currentZone, targetZone, dtSec, now) {
      if (now - this.lastPortalAttemptTime < 800) {
        return;
      }

      const portals = this.getCurrentZonePortals();
      const playerPos = this.getPlayerPosition();
      if (!playerPos) return;

      if (!portals || portals.length === 0) {
        this.updateUIStatus('[Navigation] ไม่พบประตูมิติในแมพนี้...');
        return;
      }

      let chosenPortal = portals[0];

      if (portals.length > 1) {
        const currentIdx = WORLD_MAP_PATH.indexOf(currentZone);
        const targetIdx = WORLD_MAP_PATH.indexOf(targetZone);
        const isMovingForward = targetIdx > currentIdx;

        if (isMovingForward) {
          // ไปข้างหน้าตาม World Map: เลือกประตูทางออกไกลที่สุด (Forward Exit Portal)
          chosenPortal = portals.reduce((prev, curr) => (Math.hypot(curr.x, curr.z) > Math.hypot(prev.x, prev.z) ? curr : prev), portals[0]);
        } else {
          // ถอยกลับตาม World Map: เลือกประตูทางกลับ (Return Portal)
          chosenPortal = portals.reduce((prev, curr) => (Math.hypot(curr.x, curr.z) < Math.hypot(prev.x, prev.z) ? curr : prev), portals[0]);
        }
      }

      const distToPortal = this.walkTowards(chosenPortal.x, chosenPortal.z, dtSec);
      if (distToPortal <= 2.8) {
        this.lastPortalAttemptTime = now;
        this.updateUIStatus(` ถึงประตูแล้ว กำลังข้ามไปแมพถัดไป...`);
        try {
          if (typeof this.game.tryUsePortal === 'function') this.game.tryUsePortal();
          else if (typeof this.game.tryInteractNearby === 'function') this.game.tryInteractNearby();
        } catch (e) { }
      } else {
        const targetZoneName = ZONE_LIST.find(z => z.id === targetZone)?.name || `Zone ${targetZone}`;
        this.updateUIStatus(`[Navigation] นำทางไป: ${targetZoneName} (เข้าประตู (${chosenPortal.x.toFixed(1)}, ${chosenPortal.z.toFixed(1)}) ${distToPortal.toFixed(1)}m)...`);
      }
    },

    tick() {
      const now = performance.now();
      const dtSec = Math.min(0.2, (now - this.lastTickTime) / 1000);
      this.lastTickTime = now;

      const playerPos = this.getPlayerPosition();
      const playerHp = this.getPlayerHpInfo();
      const currentZone = this.getCurrentZoneId();

      // ตรวจสอบการเปลี่ยนแมพ (Zone Transition Detection - Zero Delay)
      if (this.lastKnownZone !== currentZone) {
        this.lastKnownZone = currentZone;
        this.lastPortalAttemptTime = now + 600; // ล็อคคูลดาวน์สั้นๆ 0.6 วินาทีป้องกันการเดินชนประตูกลับ
        if (this.game.zoneTransitionPendingUntilMs) {
          this.game.zoneTransitionPendingUntilMs = 0;
        }

        // ถ้าถึงแมพเป้าหมายแล้ว ให้จบภารกิจเดินทางและเริ่มฟาร์มในแมพใหม่
        if (this.config.targetZoneId > 0 && currentZone === this.config.targetZoneId) {
          this.config.targetZoneId = 0;
          if (this.ui?.selectZone) this.ui.selectZone.value = '0';
          const zObj = ZONE_LIST.find(z => z.id === currentZone);
          this.updateUIStatus(`[Map Travel] ถึงแมพเป้าหมายแล้ว: ${zObj?.name || `Zone ${currentZone}`}`);
        }
      }

      // 1. Auto Heal (ทำงานตลอดเวลาแม้จะ Pause Bot)
      if (this.config.autoHeal && !this.game.isDead) {
        if (playerHp.percent <= this.config.healThresholdPercent) {
          if (this.tryUsePotion()) {
            this.updateUIStatus(`[Auto Heal] HP ${playerHp.percent.toFixed(0)}% ดื่มยาฮีลอัตโนมัติ`);
          }
        }
      }

      // 2. Auto Revive (คืนชีพทันทีไร้ดีเลย์)
      if (playerHp.hp > 0 && this.game.isDead) {
        this.game.isDead = false; // ปลดล็อคสถานะตายทันทีที่เลือดกลับมา
      }

      if (this.game.isDead || playerHp.hp <= 0) {
        if (this.config.autoRevive) {
          if (now - this.lastRespawnTime > 400) {
            this.lastRespawnTime = now;
            this.updateUIStatus('[Auto Revive] ตัวละครตาย กำลังกดเกิดใหม่ทันที...');
            try {
              if (typeof this.game.tryRespawn === 'function') {
                this.game.tryRespawn();
              } else if (this.game.socket?.sendRespawn) {
                this.game.socket.sendRespawn();
              }
            } catch (e) { }
          }
        } else {
          this.updateUIStatus('[Status] ตัวละครตาย (Auto Revive ปิดอยู่)');
        }
        this.updateUIData(null, playerHp, currentZone);
        return;
      }

      // Auto Dodge Monster Skills (หลบวงสกิลมอนสเตอร์)
      if (playerPos && !this.isInTown() && this.handleAutoDodge(playerPos, dtSec)) {
        this.updateUIData(null, playerHp, currentZone);
        return;
      }

      // Auto Map Progression: เปลี่ยนแมพตามเลเวลผู้เล่นอัตโนมัติ
      if (this.config.autoProgressMap && !this.game.isDead && !this.isInTown()) {
        const playerLevel = this.game.myStat?.level || 1;
        const recommendedZone = this.getRecommendedZoneForLevel(playerLevel);
        if (currentZone !== recommendedZone && this.config.targetZoneId === 0) {
          this.config.targetZoneId = recommendedZone;
          if (this.ui?.selectZone) this.ui.selectZone.value = String(recommendedZone);
          const zObj = ZONE_LIST.find(z => z.id === recommendedZone);
          this.updateUIStatus(`[Auto Progress] เลเวล ${playerLevel} ถึงเกณฑ์ กำลังเปลี่ยนแมพไป ${zObj?.name || `Zone ${recommendedZone}`}`);
        }
      }

      // 3. ระบบนำทางเลือกแมพ (Map Travel) (ทำงานตลอดเวลาแม้จะ Pause Bot)
      if (this.config.targetZoneId > 0 && currentZone !== this.config.targetZoneId) {
        this.handleMapTravel(currentZone, this.config.targetZoneId, dtSec, now);
        this.updateUIData(null, playerHp, currentZone);
        return;
      }

      // 4. Auto Walk to Gate (เมื่ออยู่ในเมือง)
      if (this.isInTown()) {
        if (this.config.targetZoneId === 1) {
          this.updateUIStatus('[Town] อยู่ในเมืองหลัก (World Tree Temple)');
          this.updateUIData(null, playerHp, currentZone);
          return;
        }

        if (this.running && this.config.autoWalkToGate && this.config.targetZoneId === 0) {
          this.handleMapTravel(1, 2, dtSec, now);
        } else {
          this.updateUIStatus('[Town] อยู่ในเมืองหลัก');
        }
        this.updateUIData(null, playerHp, currentZone);
        return;
      }

      // 5. โหมดเดินทางไปพิกัดเป้าหมาย (Waypoint Navigation) (ทำงานตลอดเวลาแม้จะ Pause Bot)
      if (this.goToTarget && playerPos) {
        const distToWaypoint = Math.hypot(this.goToTarget.x - playerPos.x, this.goToTarget.z - playerPos.z);
        if (distToWaypoint > 1.8) {
          this.walkTowards(this.goToTarget.x, this.goToTarget.z, dtSec);
          this.updateUIStatus(`[Waypoint] กำลังเดินไป ${this.goToTarget.name || 'พิกัด'} (${distToWaypoint.toFixed(1)}m)...`);
          this.updateUIData(null, playerHp, currentZone);
          return;
        } else {
          this.updateUIStatus(`[Waypoint] ถึงจุดหมายแล้ว! (${this.goToTarget.x.toFixed(1)}, ${this.goToTarget.z.toFixed(1)})`);
          this.goToTarget = null;
        }
      }

      // ถ้าผู้ใช้กด Pause Bot -> หยุดเฉพาะระบบ Auto Farm / Auto Attack
      if (!this.running) {
        this.updateUIData(null, playerHp, currentZone);
        return;
      }

      // 6. Auto Farm & Combat Loop (ทำงานเมื่อกด Start Bot)
      let target = this.getTarget();

      if (target && this.config.targetMonsterFilter !== 'ALL') {
        const filter = this.config.targetMonsterFilter;
        if (target.rawName !== filter && target.name !== filter) {
          target = null;
          if (typeof this.game.setTarget === 'function') this.game.setTarget(null);
        }
      }

      if (!target || target.hp <= 0) {
        const nearest = this.getNearestMonster();
        if (nearest && nearest.id != null) {
          this.setTarget(nearest.id);
          target = this.getTarget();
          this.updateUIStatus(`[Target] ล็อคเป้า: ${nearest.name}`);
        } else {
          if (this.config.useFarmCenter && this.config.farmCenter && playerPos) {
            const distFromCenter = Math.hypot(playerPos.x - this.config.farmCenter.x, playerPos.z - this.config.farmCenter.z);
            if (distFromCenter > 3.0) {
              this.walkTowards(this.config.farmCenter.x, this.config.farmCenter.z, dtSec);
              this.updateUIStatus(`[Farming] เดินกลับจุดฟาร์ม (${distFromCenter.toFixed(1)}m)...`);
              this.updateUIData(null, playerHp, currentZone);
              return;
            }
          }

          const filterLabel = this.discoveredMonsters.get(this.config.targetMonsterFilter) || this.config.targetMonsterFilter;
          this.updateUIStatus(this.config.targetMonsterFilter !== 'ALL'
            ? `[Search] ค้นหา '${filterLabel}' รอบตัว...`
            : '[Search] กำลังค้นหามอนสเตอร์รอบตัว...');
          if (this.game.localAnimationController?.setLocomotion) {
            this.game.localAnimationController.setLocomotion(false);
          }
          this.updateUIData(null, playerHp, currentZone);
          return;
        }
      }

      if (!target) return;

      const mPos = target.raw?.container?.position;
      const pPos = playerPos;
      let distToMonster = 0;
      if (mPos && pPos) {
        distToMonster = Math.hypot(mPos.x - pPos.x, mPos.z - pPos.z);
      }

      const attackRange = this.config.attackRangeM;

      // ถ้ายังอยู่นอกระยะโจมตี -> เดินตรงไปหามอนสเตอร์
      if (distToMonster > attackRange) {
        if (mPos) {
          this.walkTowards(mPos.x, mPos.z, dtSec);
        }
        this.updateUIStatus(`[Combat] วิ่งไปหามอน: ${target.name} (${distToMonster.toFixed(1)}m)...`);
        this.updateUIData(target, playerHp, currentZone);
        return;
      }

      // เมื่อเข้าประชิดมอนสเตอร์แล้ว
      if (this.game.localAnimationController?.setLocomotion) {
        this.game.localAnimationController.setLocomotion(false);
      }
      if (mPos && pPos) {
        const targetYaw = Math.atan2(mPos.x - pPos.x, mPos.z - pPos.z);
        this.game.playerContainer.rotation.y = targetYaw;
      }

      // ร่ายสกิลทันทีที่พร้อม (วนสกิลทั้งหมดรวมทั้งสกิล 2)
      if (this.config.useSkills && now - this.lastSkillCastTime > 250) {
        const readySkills = this.getReadySkills();
        if (readySkills.length > 0) {
          const slotToUse = readySkills[this.skillCastIndex % readySkills.length];
          this.skillCastIndex++;
          if (this.directCastSkill(slotToUse.skillId, target.id)) {
            this.lastSkillCastTime = now;
            this.updateUIStatus(`[Skill] ร่ายสกิล: ${slotToUse.name || slotToUse.skillId} ${target.name}`);
            this.updateUIData(target, playerHp, currentZone);
            return;
          }
        }
      }

      // โจมตีปกติ
      this.directAttack(target.id);
      this.updateUIStatus(`[Attack] โจมตี: ${target.name} (${target.hp}/${target.maxHp})`);
      this.updateUIData(target, playerHp, currentZone);
    },

    start() {
      this.running = true;
      console.log('%c▶ Spiki Auto Bot: เริ่มทำงาน (ACTIVE)', 'color:#00ff88;font-weight:bold');
      if (this.ui?.btnMainToggle) {
        this.ui.btnMainToggle.textContent = 'Stop Bot';
        this.ui.btnMainToggle.classList.remove('spk-btn-success');
        this.ui.btnMainToggle.classList.add('spk-btn-danger');
      }
      if (this.ui?.statusDot) {
        this.ui.statusDot.style.background = '#4ade80';
        this.ui.statusDot.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)';
      }
    },

    stop() {
      this.running = false;
      try {
        if (this.game.localAnimationController?.setLocomotion) {
          this.game.localAnimationController.setLocomotion(false);
        }
        if (this.game.combatAssist?.disableAutoAttack) {
          this.game.combatAssist.disableAutoAttack();
        }
      } catch (e) { }
      console.log('%c Spiki Auto Bot: หยุดการฟาร์ม (PAUSED)', 'color:#ffaa00;font-weight:bold');
      this.updateUIStatus('Ready (Paused - Background Systems Active)');
      if (this.ui?.btnMainToggle) {
        this.ui.btnMainToggle.textContent = 'Start Bot';
        this.ui.btnMainToggle.classList.remove('spk-btn-danger');
        this.ui.btnMainToggle.classList.add('spk-btn-success');
      }
      if (this.ui?.statusDot) {
        this.ui.statusDot.style.background = '#f59e0b';
        this.ui.statusDot.style.boxShadow = '0 0 6px rgba(245,158,11,0.5)';
      }
    },

    destroy() {
      this.running = false;
      if (this.loopTimer) {
        clearInterval(this.loopTimer);
        this.loopTimer = null;
      }
      if (this.ui?.container) {
        this.ui.container.remove();
      }
      const existingStyle = document.getElementById('spiki-custom-style');
      if (existingStyle) existingStyle.remove();
      if (this.keyHandler) {
        window.removeEventListener('keydown', this.keyHandler);
      }
      delete window.__spikiBotInstance;
    },

    updateMonsterDropdown() {
      if (!this.ui?.selectMonster) return;
      const currentVal = this.config.targetMonsterFilter;
      const select = this.ui.selectMonster;

      select.innerHTML = `<option value="ALL">All Monsters</option>`;
      for (const [rawName, displayName] of this.discoveredMonsters.entries()) {
        const opt = document.createElement('option');
        opt.value = rawName;
        opt.textContent = displayName;
        if (rawName === currentVal) opt.selected = true;
        select.appendChild(opt);
      }
    },

    createUI() {
      if (document.getElementById('spiki-bot-ui')) {
        document.getElementById('spiki-bot-ui').remove();
      }
      if (document.getElementById('spiki-custom-style')) {
        document.getElementById('spiki-custom-style').remove();
      }

      const style = document.createElement('style');
      style.id = 'spiki-custom-style';
      style.textContent = `
 #spiki-bot-ui {
 scrollbar-width: none;
 }
 #spiki-bot-ui::-webkit-scrollbar {
 display: none;
 }
 #spiki-bot-ui * {
 box-sizing: border-box;
 }

 /* ── Title Bar ── */
 .spk-titlebar {
 background: rgba(40, 44, 52, 0.98);
 padding: 6px 12px;
 font-size: 12px;
 font-weight: 600;
 color: #c8cdd5;
 cursor: move;
 display: flex;
 justify-content: space-between;
 align-items: center;
 border-bottom: 1px solid rgba(255,255,255,0.06);
 user-select: none;
 }
 .spk-titlebar .spk-dot {
 width: 8px; height: 8px;
 border-radius: 50%;
 display: inline-block;
 margin-left: 8px;
 }

 /* ── Layout ── */
 .spk-body {
 display: flex;
 min-height: 340px;
 }

 /* ── Sidebar ── */
 .spk-sidebar {
 width: 120px;
 min-width: 120px;
 background: rgba(35, 39, 48, 0.95);
 border-right: 1px solid rgba(255,255,255,0.06);
 display: flex;
 flex-direction: column;
 padding: 4px 0;
 }
 .spk-tab {
 padding: 9px 14px;
 font-size: 11.5px;
 color: #8a93a5;
 cursor: pointer;
 border: none;
 background: none;
 text-align: left;
 transition: background 0.15s, color 0.15s;
 font-family: inherit;
 white-space: nowrap;
 }
 .spk-tab:hover {
 background: rgba(255,255,255,0.04);
 color: #c0c8d8;
 }
 .spk-tab.active {
 background: rgba(75, 130, 195, 0.15);
 color: #fff;
 border-left: 2px solid #4b82c3;
 }

 /* ── Content Panel ── */
 .spk-content {
 flex: 1;
 padding: 12px 16px;
 overflow-y: auto;
 scrollbar-width: none;
 }
 .spk-content::-webkit-scrollbar {
 display: none;
 }
 .spk-panel {
 display: none;
 }
 .spk-panel.active {
 display: block;
 }
 .spk-panel-title {
 font-size: 12px;
 font-weight: 600;
 color: #9aa5b8;
 margin-bottom: 10px;
 padding-bottom: 4px;
 border-bottom: 1px solid rgba(255,255,255,0.06);
 }

 /* ── Checkbox Row ── */
 .spk-chk-row {
 display: flex;
 align-items: center;
 gap: 8px;
 margin-bottom: 8px;
 cursor: pointer;
 font-size: 12px;
 color: #c0c8d8;
 }
 .spk-chk-row input[type="checkbox"] {
 appearance: none;
 -webkit-appearance: none;
 width: 14px; height: 14px;
 border: 1px solid #4b6a8a;
 background: transparent;
 cursor: pointer;
 flex-shrink: 0;
 position: relative;
 }
 .spk-chk-row input[type="checkbox"]:checked {
 background: rgba(75, 130, 195, 0.3);
 border-color: #5a90c0;
 }
 .spk-chk-row input[type="checkbox"]:checked::after {
 content: '';
 position: absolute;
 left: 3px; top: 1px;
 width: 5px; height: 8px;
 border: solid #8ab4e0;
 border-width: 0 1.5px 1.5px 0;
 transform: rotate(45deg);
 }

 /* ── Slider ── */
 .spk-slider-wrap {
 margin-bottom: 10px;
 }
 .spk-slider-label {
 display: flex;
 justify-content: space-between;
 font-size: 11px;
 color: #8a93a5;
 margin-bottom: 4px;
 }
 .spk-slider-label span:last-child {
 color: #a0b8d0;
 }
 .spk-slider {
 -webkit-appearance: none;
 appearance: none;
 width: 100%;
 height: 3px;
 background: #2a3040;
 outline: none;
 cursor: pointer;
 border-radius: 2px;
 }
 .spk-slider::-webkit-slider-thumb {
 -webkit-appearance: none;
 appearance: none;
 width: 10px; height: 10px;
 border-radius: 50%;
 background: #4b82c3;
 cursor: pointer;
 border: none;
 }
 .spk-slider::-moz-range-thumb {
 width: 10px; height: 10px;
 border-radius: 50%;
 background: #4b82c3;
 cursor: pointer;
 border: none;
 }

 /* ── Select Dropdown ── */
 .spk-select {
 width: 100%;
 padding: 5px 8px;
 background: rgba(30, 35, 48, 0.9);
 color: #c0c8d8;
 border: 1px solid #3a4560;
 font-size: 11px;
 font-family: inherit;
 outline: none;
 cursor: pointer;
 margin-bottom: 8px;
 }
 .spk-select option {
 background: #1e2330;
 color: #c0c8d8;
 }

 /* ── Info Row ── */
 .spk-info-row {
 display: flex;
 justify-content: space-between;
 font-size: 11px;
 color: #6b7a90;
 margin-bottom: 5px;
 }
 .spk-info-row .spk-val {
 color: #a0b8d0;
 font-weight: 500;
 }

 /* ── Inline Button ── */
 .spk-btn {
 padding: 4px 10px;
 font-size: 11px;
 font-family: inherit;
 color: #c0c8d8;
 background: rgba(75, 130, 195, 0.15);
 border: 1px solid #4b6a8a;
 cursor: pointer;
 transition: background 0.15s;
 }
 .spk-btn:hover {
 background: rgba(75, 130, 195, 0.3);
 }
 .spk-btn-danger {
 color: #e06060;
 border-color: #7a3a3a;
 background: rgba(180, 60, 60, 0.12);
 }
 .spk-btn-danger:hover {
 background: rgba(180, 60, 60, 0.25);
 }
 .spk-btn-success {
 color: #60c070;
 border-color: #3a6a4a;
 background: rgba(60, 160, 80, 0.12);
 }
 .spk-btn-success:hover {
 background: rgba(60, 160, 80, 0.25);
 }

 /* ── Log Bar ── */
 .spk-log {
 padding: 5px 12px;
 font-size: 10.5px;
 color: #6b7a90;
 background: rgba(25, 28, 38, 0.9);
 border-top: 1px solid rgba(255,255,255,0.04);
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 min-height: 24px;
 display: flex;
 align-items: center;
 }

 /* ── Input ── */
 .spk-input {
 padding: 4px 8px;
 background: rgba(30, 35, 48, 0.9);
 color: #c0c8d8;
 border: 1px solid #3a4560;
 font-size: 11px;
 font-family: inherit;
 outline: none;
 text-align: center;
 }

 /* ── Separator ── */
 .spk-sep {
 border: none;
 border-top: 1px solid rgba(255,255,255,0.05);
 margin: 8px 0;
 }

 /* ── Goto row ── */
 .spk-goto-row {
 display: flex;
 gap: 4px;
 align-items: center;
 }
 `;
      document.head.appendChild(style);

      const container = document.createElement('div');
      container.id = 'spiki-bot-ui';
      Object.assign(container.style, {
        position: 'fixed',
        top: '60px',
        left: '60px',
        zIndex: '999999',
        background: 'rgba(30, 34, 44, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#c0c8d8',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
        width: '540px',
        userSelect: 'none',
        fontSize: '12px',
        overflow: 'hidden'
      });

      const zoneOptionsHtml = ZONE_LIST.map(z => `<option value="${z.id}" ${this.config.targetZoneId === z.id ? 'selected' : ''}>${z.name}</option>`).join('');

      container.innerHTML = `
 <!-- Title Bar -->
 <div class="spk-titlebar" id="spiki-drag-handle">
 <span>Spiki</span>
 <div style="display:flex;align-items:center;gap:6px;">
 <span style="font-size:9px;color:#5a6578;">[Insert] ซ่อน</span>
 <span class="spk-dot" id="spiki-status-dot" style="background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,0.5);"></span>
 </div>
 </div>

 <!-- Body -->
 <div class="spk-body">
 <!-- Sidebar -->
 <div class="spk-sidebar">
 <button class="spk-tab active" data-tab="status">Status</button>
 <button class="spk-tab" data-tab="combat">Combat</button>
 <button class="spk-tab" data-tab="navigation">Navigation</button>
 <button class="spk-tab" data-tab="farming">Farming</button>
 <button class="spk-tab" data-tab="credits">Credits</button>
 </div>

 <!-- Content -->
 <div class="spk-content">

 <!-- ══ 1. Status Panel (Default Home) ══ -->
 <div class="spk-panel active" data-panel="status">
 <div class="spk-panel-title">Status & Controls</div>

 <div class="spk-info-row">
 <span>HP</span>
 <span class="spk-val" id="spiki-player-hp">100%</span>
 </div>
 <div class="spk-info-row">
 <span>Target</span>
 <span class="spk-val" id="spiki-target-hp" style="color:#b0a060;">None</span>
 </div>
 <div class="spk-info-row">
 <span>Zone</span>
 <span class="spk-val" id="spiki-zone-text" style="color:#c0a840;">Loading...</span>
 </div>
 <div class="spk-info-row">
 <span>Position</span>
 <span class="spk-val" id="spiki-pos-text">X: 0, Z: 0</span>
 </div>

 <hr class="spk-sep">

 <div class="spk-slider-wrap">
 <div class="spk-slider-label">
 <span>Tick Interval</span>
 <span id="spiki-tick-val">${this.config.checkIntervalMs}ms</span>
 </div>
 <input type="range" class="spk-slider" id="spiki-tick-slider" min="20" max="200" step="10" value="${this.config.checkIntervalMs}">
 </div>

 <div style="margin-top:14px;">
 <button id="spiki-main-btn" class="spk-btn spk-btn-danger" style="width:100%;padding:8px 0;font-weight:600;font-size:12px;">
 Stop Bot
 </button>
 </div>
 </div>

 <!-- ══ 2. Combat Panel ══ -->
 <div class="spk-panel" data-panel="combat">
 <div class="spk-panel-title">Combat</div>

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-skill" ${this.config.useSkills ? 'checked' : ''}>
 <span>Auto Skills</span>
 </label>

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-dodge" ${this.config.autoDodge ? 'checked' : ''}>
 <span> Auto Dodge Skills </span>
 </label>

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-heal" ${this.config.autoHeal ? 'checked' : ''}>
 <span>Auto Heal</span>
 </label>

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-revive" ${this.config.autoRevive ? 'checked' : ''}>
 <span>Auto Revive</span>
 </label>

 <hr class="spk-sep">

 <div class="spk-slider-wrap">
 <div class="spk-slider-label">
 <span>Heal Threshold</span>
 <span id="spiki-heal-val">${this.config.healThresholdPercent}%</span>
 </div>
 <input type="range" class="spk-slider" id="spiki-heal-slider" min="10" max="90" step="5" value="${this.config.healThresholdPercent}">
 </div>

 <div class="spk-slider-wrap">
 <div class="spk-slider-label">
 <span>Attack Range</span>
 <span id="spiki-range-val">${this.config.attackRangeM.toFixed(1)}m</span>
 </div>
 <input type="range" class="spk-slider" id="spiki-range-slider" min="1.0" max="5.0" step="0.1" value="${this.config.attackRangeM}">
 </div>

 <hr class="spk-sep">

 <div style="font-size:11px;color:#6b7a90;margin-bottom:6px;">Target Filter</div>
 <select id="spiki-monster-select" class="spk-select">
 <option value="ALL">All Monsters</option>
 </select>
 </div>

 <!-- ══ 3. Navigation Panel ══ -->
 <div class="spk-panel" data-panel="navigation">
 <div class="spk-panel-title">Navigation</div>

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-gate" ${this.config.autoWalkToGate ? 'checked' : ''}>
 <span>Auto Walk to Gate</span>
 </label>

 <hr class="spk-sep">

 <div style="font-size:11px;color:#6b7a90;margin-bottom:6px;">Target Map</div>
 <select id="spiki-zone-select" class="spk-select">
 ${zoneOptionsHtml}
 </select>

 <div class="spk-slider-wrap">
 <div class="spk-slider-label">
 <span>Walk Speed</span>
 <span id="spiki-speed-val">${this.config.walkSpeed.toFixed(1)} m/s</span>
 </div>
 <input type="range" class="spk-slider" id="spiki-speed-slider" min="3.5" max="15.0" step="0.1" value="${this.config.walkSpeed}">
 </div>

 <hr class="spk-sep">

 <div style="font-size:11px;color:#6b7a90;margin-bottom:6px;">Go To Coordinates</div>
 <div class="spk-goto-row">
 <input type="number" id="spiki-goto-x" placeholder="X" class="spk-input" style="width:38%;">
 <input type="number" id="spiki-goto-z" placeholder="Z" class="spk-input" style="width:38%;">
 <button id="spiki-btn-goto" class="spk-btn" style="flex:1;">Go</button>
 </div>
 </div>

 <!-- ══ 4. Farming Panel ══ -->
 <div class="spk-panel" data-panel="farming">
 <div class="spk-panel-title">Farming</div>

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-autoprogress" ${this.config.autoProgressMap ? 'checked' : ''}>
 <span> Auto Progress Map (เปลี่ยนแมพตามเวล)</span>
 </label>

 <div style="font-size:11px;color:#6b7a90;margin-top:6px;margin-bottom:4px;"> Target Level Mode (เกณฑ์เลเวลมอน)</div>
 <select id="spiki-level-mode-select" class="spk-select">
 <option value="ALL" ${this.config.levelFilterMode === 'ALL' ? 'selected' : ''}>All Levels (ตีทุกเลเวล)</option>
 <option value="GTE" ${this.config.levelFilterMode === 'GTE' ? 'selected' : ''}>Monster Lv: +0 to +3 (เท่าเราถึง +3 เวล)</option>
 <option value="GT" ${this.config.levelFilterMode === 'GT' ? 'selected' : ''}>Monster Lv: +1 to +3 (มากกว่าเรา 1-3 เวล)</option>
 <option value="EQ" ${this.config.levelFilterMode === 'EQ' ? 'selected' : ''}>Monster Lv == Player (เท่าเราเท่านั้น)</option>
 </select>

 <hr class="spk-sep">

 <label class="spk-chk-row">
 <input type="checkbox" id="spiki-toggle-anchor" ${this.config.useFarmCenter ? 'checked' : ''}>
 <span>Lock Farm Radius</span>
 </label>

 <div class="spk-info-row">
 <span>Anchor Point</span>
 <span class="spk-val" id="spiki-anchor-coords">${this.config.farmCenter ? `(${this.config.farmCenter.x.toFixed(0)}, ${this.config.farmCenter.z.toFixed(0)})` : 'Not set'}</span>
 </div>

 <button id="spiki-btn-anchor" class="spk-btn" style="width:100%;margin-bottom:10px;">Pin Current Position</button>

 <div class="spk-slider-wrap">
 <div class="spk-slider-label">
 <span>Farm Radius</span>
 <span id="spiki-radius-val">${this.config.farmRadius}m</span>
 </div>
 <input type="range" class="spk-slider" id="spiki-radius-slider" min="15" max="120" step="5" value="${this.config.farmRadius}">
 </div>

 <div class="spk-slider-wrap">
 <div class="spk-slider-label">
 <span>Search Distance</span>
 <span id="spiki-search-val">${this.config.maxSearchDistance}m</span>
 </div>
 <input type="range" class="spk-slider" id="spiki-search-slider" min="30" max="200" step="10" value="${this.config.maxSearchDistance}">
 </div>
 </div>

 <!-- ══ 5. Credits Panel ══ -->
 <div class="spk-panel" data-panel="credits">
 <div class="spk-panel-title">Credits & Info</div>

          <div style="font-size:13px;font-weight:600;color:#8ab4e0;margin-bottom:3px;">
            Spiki Bot
          </div>
          <div style="font-size:11px;color:#6b7a90;margin-bottom:12px;">
            By <a href="https://github.com/Yusinz-Zero" target="_blank" rel="noopener noreferrer" style="color:#58a6ff;text-decoration:none;font-weight:600;transition:color 0.2s;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Yusinz-Zero</a>
          </div>

 <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:4px;padding:8px 10px;margin-bottom:10px;">
 <div style="font-size:11px;color:#a0b8d0;font-weight:600;margin-bottom:4px;"> Quick Shortcuts</div>
 <div style="font-size:11px;color:#8a93a5;line-height:1.6;">
 • <b style="color:#c0c8d8;">[Insert]</b> : Hide / Show Bot UI<br>
 • <b style="color:#c0c8d8;">[↑] + [Enter]</b> : Instant Inject & Hook
 </div>
 </div>

 <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:4px;padding:8px 10px;">
 <div style="font-size:11px;color:#a0b8d0;font-weight:600;margin-bottom:4px;"> Core Features</div>
 <div style="font-size:11px;color:#8a93a5;line-height:1.6;">
 • Direct Zero-Latency Packet Engine<br>
 • English Monster Localization (100+ Monsters)<br>
 • Cross-Zone Portal Router<br>
 • Background Auto-Revive, Heal & Navigation
 </div>
 </div>
 </div>

 </div>
 </div>

 <!-- Log Bar -->
 <div class="spk-log" id="spiki-log">Ready</div>
 `;

      document.body.appendChild(container);

      // ── Tab Switching ──
      const tabs = container.querySelectorAll('.spk-tab');
      const panels = container.querySelectorAll('.spk-panel');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          const target = container.querySelector(`.spk-panel[data-panel="${tab.dataset.tab}"]`);
          if (target) target.classList.add('active');
        });
      });

      // ── Make Draggable ──
      const dragHandle = container.querySelector('#spiki-drag-handle');
      let isDragging = false;
      let offsetX = 0, offsetY = 0;

      dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        container.style.left = `${Math.max(0, e.clientX - offsetX)}px`;
        container.style.top = `${Math.max(0, e.clientY - offsetY)}px`;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // ปุ่ม Insert ซ่อน/แสดงหน้าต่าง
      this.keyHandler = (e) => {
        if (e.key === 'Insert' || e.code === 'Insert') {
          container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
      };
      window.addEventListener('keydown', this.keyHandler);

      // ── Element References ──
      const btnMainToggle = container.querySelector('#spiki-main-btn');
      const logText = container.querySelector('#spiki-log');
      const statusDot = container.querySelector('#spiki-status-dot');
      const playerHpText = container.querySelector('#spiki-player-hp');
      const targetHpText = container.querySelector('#spiki-target-hp');
      const posText = container.querySelector('#spiki-pos-text');
      const zoneText = container.querySelector('#spiki-zone-text');

      const selectZone = container.querySelector('#spiki-zone-select');
      const selectMonster = container.querySelector('#spiki-monster-select');
      const chkAutoProgress = container.querySelector('#spiki-toggle-autoprogress');
      const selectLevelMode = container.querySelector('#spiki-level-mode-select');
      const btnAnchor = container.querySelector('#spiki-btn-anchor');
      const chkAnchor = container.querySelector('#spiki-toggle-anchor');
      const anchorCoords = container.querySelector('#spiki-anchor-coords');
      const radiusSlider = container.querySelector('#spiki-radius-slider');
      const radiusVal = container.querySelector('#spiki-radius-val');

      const inputGotoX = container.querySelector('#spiki-goto-x');
      const inputGotoZ = container.querySelector('#spiki-goto-z');
      const btnGoto = container.querySelector('#spiki-btn-goto');

      const speedSlider = container.querySelector('#spiki-speed-slider');
      const speedVal = container.querySelector('#spiki-speed-val');

      const chkHeal = container.querySelector('#spiki-toggle-heal');
      const chkRevive = container.querySelector('#spiki-toggle-revive');
      const chkDodge = container.querySelector('#spiki-toggle-dodge');
      const chkGate = container.querySelector('#spiki-toggle-gate');
      const chkSkill = container.querySelector('#spiki-toggle-skill');

      const healSlider = container.querySelector('#spiki-heal-slider');
      const healVal = container.querySelector('#spiki-heal-val');
      const rangeSlider = container.querySelector('#spiki-range-slider');
      const rangeVal = container.querySelector('#spiki-range-val');
      const searchSlider = container.querySelector('#spiki-search-slider');
      const searchVal = container.querySelector('#spiki-search-val');
      const tickSlider = container.querySelector('#spiki-tick-slider');
      const tickVal = container.querySelector('#spiki-tick-val');

      // ── Event Listeners ──

      selectZone.addEventListener('change', (e) => {
        const zid = parseInt(e.target.value, 10);
        this.config.targetZoneId = zid;
        const zObj = ZONE_LIST.find(z => z.id === zid);
        this.updateUIStatus(`Map target: ${zObj?.name}`);
      });

      selectMonster.addEventListener('change', (e) => {
        this.config.targetMonsterFilter = e.target.value;
        const displayLabel = this.discoveredMonsters.get(e.target.value) || e.target.value;
        const msg = e.target.value === 'ALL' ? 'Target: All Monsters' : `Target locked: ${displayLabel}`;
        this.updateUIStatus(msg);
      });

      chkAutoProgress.addEventListener('change', (e) => {
        this.config.autoProgressMap = e.target.checked;
        this.updateUIStatus(e.target.checked ? ' เปิดระบบเปลี่ยนแมพตามเลเวลอัตโนมัติ' : ' ปิดระบบเปลี่ยนแมพตามเลเวล');
      });

      selectLevelMode.addEventListener('change', (e) => {
        this.config.levelFilterMode = e.target.value;
        const labels = {
          ALL: 'ตีทุกเลเวล',
          GTE: 'เลเวลเท่าเราหรือมากกว่า (Lv >= Player)',
          GT: 'เลเวลมากกว่าเราเท่านั้น (Lv > Player)',
          EQ: 'เลเวลเท่ากับเราเท่านั้น (Lv == Player)'
        };
        this.updateUIStatus(` เกณฑ์เลเวลมอน: ${labels[e.target.value] || e.target.value}`);
      });

      btnAnchor.addEventListener('click', () => {
        const p = this.getPlayerPosition();
        if (p) {
          this.config.farmCenter = { x: p.x, z: p.z };
          this.config.useFarmCenter = true;
          chkAnchor.checked = true;
          anchorCoords.textContent = `(${p.x.toFixed(0)}, ${p.z.toFixed(0)})`;
          this.updateUIStatus(`Anchor set at (${p.x.toFixed(0)}, ${p.z.toFixed(0)}) r=${this.config.farmRadius}m`);
        }
      });

      chkAnchor.addEventListener('change', (e) => {
        this.config.useFarmCenter = e.target.checked;
        if (e.target.checked && !this.config.farmCenter) {
          const p = this.getPlayerPosition();
          if (p) {
            this.config.farmCenter = { x: p.x, z: p.z };
            anchorCoords.textContent = `(${p.x.toFixed(0)}, ${p.z.toFixed(0)})`;
          }
        }
      });

      radiusSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.config.farmRadius = val;
        radiusVal.textContent = `${val}m`;
      });

      searchSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.config.maxSearchDistance = val;
        searchVal.textContent = `${val}m`;
      });

      btnGoto.addEventListener('click', () => {
        const x = parseFloat(inputGotoX.value);
        const z = parseFloat(inputGotoZ.value);
        if (!isNaN(x) && !isNaN(z)) {
          this.goToTarget = { x, z, name: `(${x.toFixed(0)}, ${z.toFixed(0)})` };
          this.updateUIStatus(`Walking to (${x.toFixed(0)}, ${z.toFixed(0)})...`);
        }
      });

      speedSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.config.walkSpeed = val;
        speedVal.textContent = `${val.toFixed(1)} m/s`;
      });

      healSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.config.healThresholdPercent = val;
        healVal.textContent = `${val}%`;
      });

      rangeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.config.attackRangeM = val;
        rangeVal.textContent = `${val.toFixed(1)}m`;
      });

      tickSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.config.checkIntervalMs = val;
        tickVal.textContent = `${val}ms`;
        if (this.loopTimer) {
          clearInterval(this.loopTimer);
          this.loopTimer = setInterval(() => this.tick(), val);
        }
      });

      chkHeal.addEventListener('change', (e) => {
        this.config.autoHeal = e.target.checked;
      });

      chkRevive.addEventListener('change', (e) => {
        this.config.autoRevive = e.target.checked;
      });

      chkDodge.addEventListener('change', (e) => {
        this.config.autoDodge = e.target.checked;
        this.updateUIStatus(e.target.checked ? ' เปิดระบบหลบวงสกิลมอนสเตอร์' : ' ปิดระบบหลบสกิลมอนสเตอร์');
      });

      chkGate.addEventListener('change', (e) => {
        this.config.autoWalkToGate = e.target.checked;
      });

      chkSkill.addEventListener('change', (e) => {
        this.config.useSkills = e.target.checked;
      });

      btnMainToggle.addEventListener('click', () => {
        if (this.running) {
          this.stop();
        } else {
          this.start();
        }
      });

      this.ui = { container, btnMainToggle, logText, statusDot, playerHpText, targetHpText, posText, zoneText, selectMonster, selectZone };
    },

    updateUIStatus(msg) {
      if (this.ui?.logText) this.ui.logText.textContent = msg;
    },

    updateUIData(target, playerHp, currentZone) {
      if (this.ui?.playerHpText && playerHp) {
        this.ui.playerHpText.textContent = `${playerHp.hp}/${playerHp.maxHp} (${playerHp.percent.toFixed(0)}%)`;
        this.ui.playerHpText.style.color = playerHp.percent <= 35 ? '#ef4444' : playerHp.percent <= 65 ? '#f59e0b' : '#4ade80';
      }
      if (this.ui?.targetHpText) {
        this.ui.targetHpText.textContent = target ? `${target.name} [${target.hp}/${target.maxHp}]` : 'None';
      }
      const p = this.getPlayerPosition();
      if (this.ui?.posText && p) {
        this.ui.posText.textContent = `X: ${p.x.toFixed(1)}, Z: ${p.z.toFixed(1)}`;
      }
      if (this.ui?.zoneText && currentZone) {
        const zObj = ZONE_LIST.find(z => z.id === currentZone);
        this.ui.zoneText.textContent = zObj ? zObj.name.replace(/^[^\s]+\s*/, '') : `Zone ${currentZone}`;
      }
    }
  };

  bot.createUI();
  window.__spikiBotInstance = bot;
  bot.lastTickTime = performance.now();
  bot.loopTimer = setInterval(() => bot.tick(), bot.config.checkIntervalMs);
  bot.start();
})();