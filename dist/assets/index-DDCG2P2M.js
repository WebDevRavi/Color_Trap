(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();const l={SESSION_DURATION_SEC:60,COUNTDOWN_DURATION_SEC:3,FEEDBACK_DURATIONS:{EASY:400,NORMAL:300,HARD:200,"VERY HARD":120},SPEED_BONUS_TIER_1_MS:500,SPEED_BONUS_TIER_2_MS:750,SPEED_BONUS_TIER_3_MS:1e3,BASE_SCORE:1,STREAK_MILESTONES:[3,5,10,20,30],STORAGE_KEYS:{BEST_SCORE:"color_trap_best_score_v1",BEST_STREAK:"color_trap_best_streak_v1",STATS:"color_trap_stats_v1",SETTINGS:"color_trap_settings_v1",REWARD_POINTS:"color_trap_reward_points_v2",TOTAL_REWARD_POINTS_EARNED:"color_trap_total_points_earned_v2",UNLOCKED_ITEMS:"color_trap_unlocked_items_v2",ACTIVE_THEME:"color_trap_active_theme_v2",LAST_DAILY_REWARD_DATE:"color_trap_last_daily_reward_date_v1",SAVE_VERSION:"color_trap_save_version_v2",TUTORIAL_SEEN:"color_trap_tutorial_seen_v2"},SHOP_ITEMS:[{id:"classic_neon",name:"Classic Neon Splatter",cost:0,desc:"Default vibrant arcade visual style with rich splatters.",icon:"🎨"},{id:"cyber_arcade",name:"8-Bit Cyber Arcade",cost:500,desc:"Retro 80s arcade neon glow with sharp cyber borders.",icon:"🕹️"},{id:"ultra_speed_vortex",name:"Ultra Speed Vortex",cost:1e3,desc:"High-octane hyperspace theme for master players.",icon:"⚡"}],DAILY_REWARD_AMOUNT:100,COLORS:[{id:"red",name:"RED",hex:"#E82030",glowHex:"#FF3344",darkHex:"#8B0B17"},{id:"blue",name:"BLUE",hex:"#0088FF",glowHex:"#38A4FF",darkHex:"#004A9E"},{id:"green",name:"GREEN",hex:"#1BB82D",glowHex:"#30D845",darkHex:"#0C6E18"},{id:"yellow",name:"YELLOW",hex:"#FFB800",glowHex:"#FFCC22",darkHex:"#A36F00"},{id:"purple",name:"PURPLE",hex:"#963BEB",glowHex:"#B25DFF",darkHex:"#581799"},{id:"orange",name:"ORANGE",hex:"#FF6D1B",glowHex:"#FF8838",darkHex:"#A63E00"}],SHAPES:["circle","square","triangle","star","diamond"],ICONS:["heart","star","lightning","target","flame"],PATTERNS:["solid","stripes","dots","waves"],PRIMARY_COLOR_IDS:["red","blue","green","yellow"]};class P{memoryFallback=new Map;isLocalStorageAvailable=!0;changeListeners=new Set;constructor(){try{const t="__storage_test__";localStorage.setItem(t,t),localStorage.removeItem(t)}catch{this.isLocalStorageAvailable=!1,console.warn("Color Trap: localStorage is not available, falling back to memory.")}this.runMigration()}runMigration(){this.getItem(l.STORAGE_KEYS.SAVE_VERSION)!=="2"&&(this.setItem(l.STORAGE_KEYS.REWARD_POINTS,"0"),this.setItem(l.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED,"0"),this.setItem(l.STORAGE_KEYS.UNLOCKED_ITEMS,JSON.stringify(["classic_neon"])),this.setItem(l.STORAGE_KEYS.ACTIVE_THEME,"classic_neon"),this.setItem(l.STORAGE_KEYS.SAVE_VERSION,"2"))}notifyChange(){this.changeListeners.forEach(t=>{try{t()}catch(e){console.error("Storage change listener error:",e)}})}subscribe(t){return this.changeListeners.add(t),()=>{this.changeListeners.delete(t)}}getItem(t){if(this.isLocalStorageAvailable)try{return localStorage.getItem(t)}catch{return this.memoryFallback.get(t)||null}return this.memoryFallback.get(t)||null}setItem(t,e){if(this.isLocalStorageAvailable)try{localStorage.setItem(t,e),this.notifyChange();return}catch{}this.memoryFallback.set(t,e),this.notifyChange()}getBestScore(){const t=this.getItem(l.STORAGE_KEYS.BEST_SCORE);if(!t)return 0;const e=parseInt(t,10);return isNaN(e)?0:Math.max(0,e)}setBestScore(t){const e=this.getBestScore();return t>e?(this.setItem(l.STORAGE_KEYS.BEST_SCORE,t.toString()),!0):!1}getBestStreak(){const t=this.getItem(l.STORAGE_KEYS.BEST_STREAK);if(!t)return 0;const e=parseInt(t,10);return isNaN(e)?0:Math.max(0,e)}setBestStreak(t){const e=this.getBestStreak();return t>e?(this.setItem(l.STORAGE_KEYS.BEST_STREAK,t.toString()),!0):!1}getRewardPoints(){const t=this.getItem(l.STORAGE_KEYS.REWARD_POINTS);if(!t)return 0;const e=parseInt(t,10);return isNaN(e)?0:Math.max(0,e)}getTotalRewardPointsEarned(){const t=this.getItem(l.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED);if(!t)return this.getRewardPoints();const e=parseInt(t,10);return isNaN(e)?0:Math.max(0,e)}awardCorrectAnswerPoint(){const t=this.getRewardPoints(),e=this.getTotalRewardPointsEarned(),s=t+1,n=e+1;return this.setItem(l.STORAGE_KEYS.REWARD_POINTS,s.toString()),this.setItem(l.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED,n.toString()),s}addRewardPoints(t){const e=Math.max(0,Math.floor(t)),s=this.getRewardPoints(),n=this.getTotalRewardPointsEarned(),i=s+e,a=n+e;return this.setItem(l.STORAGE_KEYS.REWARD_POINTS,i.toString()),this.setItem(l.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED,a.toString()),i}spendRewardPoints(t){const e=this.getRewardPoints();if(e<t||t<0)return!1;const s=e-t;return this.setItem(l.STORAGE_KEYS.REWARD_POINTS,s.toString()),!0}getUnlockedItems(){const t=this.getItem(l.STORAGE_KEYS.UNLOCKED_ITEMS);if(!t)return["classic_neon"];try{const e=JSON.parse(t);return Array.isArray(e)?(e.includes("classic_neon")||e.unshift("classic_neon"),e):["classic_neon"]}catch{return["classic_neon"]}}isItemUnlocked(t){return t==="classic_neon"?!0:this.getUnlockedItems().includes(t)}unlockItem(t){const e=this.getUnlockedItems();e.includes(t)||(e.push(t),this.setItem(l.STORAGE_KEYS.UNLOCKED_ITEMS,JSON.stringify(e)))}getActiveTheme(){return this.getItem(l.STORAGE_KEYS.ACTIVE_THEME)||"classic_neon"}setActiveTheme(t){return this.isItemUnlocked(t)?(this.setItem(l.STORAGE_KEYS.ACTIVE_THEME,t),!0):!1}purchaseShopItem(t){if(this.isItemUnlocked(t))return{success:!1,message:"Item is already unlocked."};const e=l.SHOP_ITEMS.find(i=>i.id===t);if(!e)return{success:!1,message:"Item does not exist."};const s=this.getRewardPoints();if(s<e.cost){const i=e.cost-s;return{success:!1,message:`NOT ENOUGH POINTS: Need ${i} more points (Cost: ${e.cost} PTS).`,neededPoints:i}}return this.spendRewardPoints(e.cost)?(this.unlockItem(t),this.setActiveTheme(t),{success:!0,message:`UNLOCKED ${e.name.toUpperCase()}!`}):{success:!1,message:"Purchase transaction could not be completed."}}getTodayDateString(){const t=new Date,e=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${e}-${s}-${n}`}getLastDailyRewardDate(){return this.getItem(l.STORAGE_KEYS.LAST_DAILY_REWARD_DATE)}canClaimDailyReward(){const t=this.getTodayDateString();return this.getLastDailyRewardDate()!==t}claimDailyReward(){const t=l.DAILY_REWARD_AMOUNT,e=this.getTodayDateString();if(!this.canClaimDailyReward())return{success:!1,rewardAmount:0,newPoints:this.getRewardPoints(),message:"Already claimed today! Return tomorrow for your next reward."};this.setItem(l.STORAGE_KEYS.LAST_DAILY_REWARD_DATE,e);const s=this.addRewardPoints(t);return{success:!0,rewardAmount:t,newPoints:s,message:`Claimed +${t} Reward Points!`}}hasSeenTutorial(){return this.getItem(l.STORAGE_KEYS.TUTORIAL_SEEN)==="true"}setTutorialSeen(t=!0){this.setItem(l.STORAGE_KEYS.TUTORIAL_SEEN,t?"true":"false")}getSettings(){const t={soundEnabled:!0,musicEnabled:!0,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,hardMode:!1,difficulty:"NORMAL"},e=this.getItem(l.STORAGE_KEYS.SETTINGS);if(!e)return t;try{const s=JSON.parse(e),n=s.difficulty||(s.hardMode?"HARD":"NORMAL");return{...t,...s,difficulty:n,hardMode:n==="HARD"||n==="VERY HARD"}}catch{return t}}saveSettings(t){const e=this.getSettings();let s=t.difficulty!==void 0?t.difficulty:e.difficulty;t.hardMode!==void 0&&t.difficulty===void 0&&(s=t.hardMode?"HARD":"NORMAL");const n={...e,...t,difficulty:s,hardMode:s==="HARD"||s==="VERY HARD"};try{this.setItem(l.STORAGE_KEYS.SETTINGS,JSON.stringify(n))}catch{}return n}getStats(){const t={bestScore:this.getBestScore(),bestStreak:this.getBestStreak(),totalGamesPlayed:0,totalScore:0,totalCorrect:0,totalWrong:0,totalReactionTimeMs:0,bestReactionTimeMs:9999,totalRewardPointsEarned:this.getTotalRewardPointsEarned()},e=this.getItem(l.STORAGE_KEYS.STATS);if(!e)return t;try{const s=JSON.parse(e);return{bestScore:this.getBestScore(),bestStreak:this.getBestStreak(),totalGamesPlayed:s.totalGamesPlayed||0,totalScore:s.totalScore||0,totalCorrect:s.totalCorrect||0,totalWrong:s.totalWrong||0,totalReactionTimeMs:s.totalReactionTimeMs||0,bestReactionTimeMs:s.bestReactionTimeMs||9999,totalRewardPointsEarned:this.getTotalRewardPointsEarned()}}catch{return t}}recordGameCompletion(t){const e=this.setBestScore(t.score),s=this.setBestStreak(t.streak),n=this.getStats();n.totalGamesPlayed+=1,n.totalScore+=Math.max(0,t.score),n.totalCorrect+=t.correct,n.totalWrong+=t.wrong,t.totalReactionTimeMs&&(n.totalReactionTimeMs+=t.totalReactionTimeMs),n.bestScore=Math.max(n.bestScore,t.score),n.bestStreak=Math.max(n.bestStreak,t.streak),t.bestReactionTimeMs>0&&t.bestReactionTimeMs<n.bestReactionTimeMs&&(n.bestReactionTimeMs=t.bestReactionTimeMs),n.totalRewardPointsEarned=this.getTotalRewardPointsEarned();try{this.setItem(l.STORAGE_KEYS.STATS,JSON.stringify(n))}catch{}return{isNewBestScore:e,isNewBestStreak:s}}resetStats(){const t={bestScore:0,bestStreak:0,totalGamesPlayed:0,totalScore:0,totalCorrect:0,totalWrong:0,totalReactionTimeMs:0,bestReactionTimeMs:9999,totalRewardPointsEarned:this.getTotalRewardPointsEarned()};this.setItem(l.STORAGE_KEYS.BEST_SCORE,"0"),this.setItem(l.STORAGE_KEYS.BEST_STREAK,"0"),this.setItem(l.STORAGE_KEYS.STATS,JSON.stringify(t))}}const p=new P;class L{ctx=null;isMuted=!1;isMusicMuted=!1;musicOscillator=null;musicGain=null;constructor(){const t=p.getSettings();this.isMuted=!t.soundEnabled,this.isMusicMuted=!t.musicEnabled}initCtx(){if(this.isMuted)return null;try{if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx=new t)}return this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}catch{return null}}isSoundMuted(){return this.isMuted}isMusicMutedState(){return this.isMusicMuted}toggleSound(){return this.isMuted=!this.isMuted,p.saveSettings({soundEnabled:!this.isMuted}),this.isMuted||this.playClick(),!this.isMuted}playClick(){if(this.isMuted)return;const t=this.initCtx();if(t)try{const e=t.currentTime,s=t.createOscillator(),n=t.createGain();s.type="triangle",s.frequency.setValueAtTime(600,e),s.frequency.exponentialRampToValueAtTime(200,e+.06),n.gain.setValueAtTime(.2,e),n.gain.exponentialRampToValueAtTime(.001,e+.06),s.connect(n),n.connect(t.destination),s.start(e),s.stop(e+.07)}catch{}}playCorrect(t=0){if(this.isMuted)return;const e=this.initCtx();if(e)try{const s=e.currentTime,n=Math.min(880,523.25+Math.min(t,20)*18);[n,n*1.5].forEach((i,a)=>{const o=e.createOscillator(),r=e.createGain();o.type=a===0?"sine":"triangle",o.frequency.setValueAtTime(i,s+a*.03),o.frequency.exponentialRampToValueAtTime(i*1.25,s+.18+a*.03),r.gain.setValueAtTime(.18,s+a*.03),r.gain.exponentialRampToValueAtTime(.001,s+.22+a*.03),o.connect(r),r.connect(e.destination),o.start(s+a*.03),o.stop(s+.25+a*.03)})}catch{}}playWrong(){if(this.isMuted)return;const t=this.initCtx();if(t)try{const e=t.currentTime,s=t.createOscillator(),n=t.createGain();s.type="sawtooth",s.frequency.setValueAtTime(160,e),s.frequency.linearRampToValueAtTime(110,e+.22),n.gain.setValueAtTime(.22,e),n.gain.exponentialRampToValueAtTime(.001,e+.22),s.connect(n),n.connect(t.destination),s.start(e),s.stop(e+.24)}catch{}}playCountdownBeep(t=!1){if(this.isMuted)return;const e=this.initCtx();if(e)try{const s=e.currentTime,n=e.createOscillator(),i=e.createGain();n.type="sine";const a=t?880:440,o=t?.35:.12;n.frequency.setValueAtTime(a,s),t&&n.frequency.exponentialRampToValueAtTime(1174.66,s+o),i.gain.setValueAtTime(t?.28:.18,s),i.gain.exponentialRampToValueAtTime(.001,s+o),n.connect(i),i.connect(e.destination),n.start(s),n.stop(s+o+.02)}catch{}}playStreakMilestone(){if(this.isMuted)return;const t=this.initCtx();if(t)try{const e=[523.25,659.25,783.99,1046.5],s=t.currentTime;e.forEach((n,i)=>{const a=t.createOscillator(),o=t.createGain();a.type="sine",a.frequency.setValueAtTime(n,s+i*.05),o.gain.setValueAtTime(.2,s+i*.05),o.gain.exponentialRampToValueAtTime(.001,s+i*.05+.2),a.connect(o),o.connect(t.destination),a.start(s+i*.05),a.stop(s+i*.05+.22)})}catch{}}playGameOver(){if(this.isMuted)return;const t=this.initCtx();if(t)try{const e=[[523.25,659.25,783.99],[587.33,739.99,880],[659.25,830.61,987.77],[783.99,987.77,1174.66]],s=t.currentTime;e.forEach((n,i)=>{n.forEach(a=>{const o=t.createOscillator(),r=t.createGain();o.type="triangle",o.frequency.setValueAtTime(a,s+i*.14),r.gain.setValueAtTime(.12,s+i*.14),r.gain.exponentialRampToValueAtTime(.001,s+i*.14+(i===e.length-1?.6:.25)),o.connect(r),r.connect(t.destination),o.start(s+i*.14),o.stop(s+i*.14+(i===e.length-1?.65:.28))})})}catch{}}cleanup(){if(this.musicOscillator){try{this.musicOscillator.stop(),this.musicOscillator.disconnect()}catch{}this.musicOscillator=null}if(this.musicGain){try{this.musicGain.disconnect()}catch{}this.musicGain=null}}}const d=new L;class D{container;isProcessingAction=!1;constructor(){this.container=document.getElementById("modal-container")}showPauseModal(t,e,s){this.container.innerHTML=`
      <div class="modal-card">
        <h2 class="modal-title">⏸️ GAME PAUSED</h2>
        <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 280px; margin: 12px 0;">
          <button id="modal-resume-btn" class="btn-arcade btn-primary-yellow" style="font-size: 1.4rem; padding: 12px 24px; min-width: auto;">RESUME ▶</button>
          <button id="modal-restart-btn" class="btn-arcade btn-purple">RESTART 🔄</button>
          <button id="modal-quit-btn" class="btn-arcade btn-blue">QUIT TO HOME 🏠</button>
        </div>
      </div>
    `,this.container.classList.remove("hidden"),document.getElementById("modal-resume-btn")?.addEventListener("click",()=>{d.playClick(),this.close(),t()}),document.getElementById("modal-restart-btn")?.addEventListener("click",()=>{d.playClick(),this.close(),e()}),document.getElementById("modal-quit-btn")?.addEventListener("click",()=>{d.playClick(),this.close(),s()})}showSettingsModal(t){const e=p.getSettings();this.container.innerHTML=`
      <div class="modal-card">
        <h2 class="modal-title">⚙️ SETTINGS</h2>
        <div style="width: 100%;">
          <div class="modal-row">
            <span>🔊 Sound Effects</span>
            <input type="checkbox" id="setting-sound" ${e.soundEnabled?"checked":""} style="width: 22px; height: 22px; cursor: pointer;" />
          </div>
          <div class="modal-row">
            <span>✨ Reduced Motion</span>
            <input type="checkbox" id="setting-motion" ${e.reducedMotion?"checked":""} style="width: 22px; height: 22px; cursor: pointer;" />
          </div>
          <div class="modal-row">
            <span>⚡ Difficulty Mode</span>
            <select id="setting-difficulty" style="background: #1C2347; color: #FFDE59; border: 1px solid #FFC400; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer;">
              <option value="EASY" ${e.difficulty==="EASY"?"selected":""}>EASY</option>
              <option value="NORMAL" ${e.difficulty==="NORMAL"?"selected":""}>NORMAL</option>
              <option value="HARD" ${e.difficulty==="HARD"?"selected":""}>HARD</option>
              <option value="VERY HARD" ${e.difficulty==="VERY HARD"?"selected":""}>VERY HARD</option>
            </select>
          </div>
        </div>
        <button id="modal-close-settings" class="btn-arcade btn-primary-yellow modal-close-btn" style="min-width: 180px; font-size: 1.2rem; padding: 10px 24px;">DONE</button>
      </div>
    `,this.container.classList.remove("hidden");const s=document.getElementById("setting-sound");s?.addEventListener("change",()=>{const a=s.checked;p.saveSettings({soundEnabled:a}),t&&t(a),a&&d.playClick()});const n=document.getElementById("setting-motion");n?.addEventListener("change",()=>{p.saveSettings({reducedMotion:n.checked}),d.playClick()});const i=document.getElementById("setting-difficulty");i?.addEventListener("change",()=>{const a=i.value;p.saveSettings({difficulty:a}),d.playClick()}),document.getElementById("modal-close-settings")?.addEventListener("click",()=>{d.playClick(),this.close()})}showStatsModal(){const t=p.getStats(),e=p.getRewardPoints(),s=p.getTotalRewardPointsEarned(),n=p.getUnlockedItems(),i=l.SHOP_ITEMS.length,a=t.totalCorrect+t.totalWrong,o=a>0?Math.round(t.totalCorrect/a*100):0,r=a>0?Math.round(t.totalReactionTimeMs/a):0,c=t.bestReactionTimeMs<9e3?`${t.bestReactionTimeMs} ms`:"—";this.container.innerHTML=`
      <div class="modal-card">
        <h2 class="modal-title">📊 ALL-TIME STATS</h2>
        <div style="width: 100%; max-height: 380px; overflow-y: auto; padding-right: 4px;">
          <div class="modal-row">
            <span>💎 Available Reward Points</span>
            <strong style="color: #00C8FF; font-size: 1.3rem;">${e}</strong>
          </div>
          <div class="modal-row">
            <span>🌟 Lifetime Points Earned</span>
            <strong style="color: #FFDE59;">${s}</strong>
          </div>
          <div class="modal-row">
            <span>👑 High Score</span>
            <strong style="color: #FFC400; font-size: 1.3rem;">${t.bestScore}</strong>
          </div>
          <div class="modal-row">
            <span>🔥 Best Streak</span>
            <strong style="color: #FF8533; font-size: 1.3rem;">x${t.bestStreak}</strong>
          </div>
          <div class="modal-row">
            <span>🎮 Games Completed</span>
            <strong>${t.totalGamesPlayed}</strong>
          </div>
          <div class="modal-row">
            <span>🎯 Total Correct</span>
            <strong style="color: #14C834;">${t.totalCorrect}</strong>
          </div>
          <div class="modal-row">
            <span>❌ Total Wrong</span>
            <strong style="color: #FF4557;">${t.totalWrong}</strong>
          </div>
          <div class="modal-row">
            <span>📈 Lifetime Accuracy</span>
            <strong style="color: #0088FF;">${o}%</strong>
          </div>
          <div class="modal-row">
            <span>⏱️ Avg. Reaction Time</span>
            <strong style="color: #6CE5E8;">${r} ms</strong>
          </div>
          <div class="modal-row">
            <span>⚡ Best Reaction Time</span>
            <strong style="color: #A23DF5;">${c}</strong>
          </div>
          <div class="modal-row">
            <span>🎨 Themes Unlocked</span>
            <strong style="color: #B57BFF;">${n.length} / ${i}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 14px; width: 100%; justify-content: center; align-items: center; margin-top: 22px;">
          <button id="modal-reset-stats-btn" class="btn-danger" style="padding: 10px 20px; font-size: 0.95rem;">
            🗑️ RESET STATS
          </button>
          <button id="modal-close-stats" class="btn-arcade btn-primary-yellow" style="min-width: 140px; font-size: 1.15rem; padding: 10px 24px;">
            CLOSE
          </button>
        </div>
      </div>
    `,this.container.classList.remove("hidden"),document.getElementById("modal-close-stats")?.addEventListener("click",()=>{d.playClick(),this.close()}),document.getElementById("modal-reset-stats-btn")?.addEventListener("click",()=>{d.playClick(),this.showResetConfirmationModal()})}showResetConfirmationModal(){this.container.innerHTML=`
      <div class="modal-card">
        <h2 class="modal-title" style="color: #FF4557;">⚠️ RESET STATISTICS?</h2>
        <p style="font-size: 1.05rem; color: #E0E8FF; margin: 12px 0 20px; line-height: 1.5;">
          This will reset your score, streak, and reaction time history.<br/>
          <strong>Your Reward Points and Unlocked Themes will NOT be lost.</strong><br/>
          This action cannot be undone.
        </p>
        <div style="display: flex; gap: 16px; width: 100%; justify-content: center;">
          <button id="confirm-cancel-btn" class="btn-arcade btn-blue" style="min-width: 130px; padding: 10px 20px;">
            CANCEL
          </button>
          <button id="confirm-reset-btn" class="btn-danger" style="min-width: 130px; padding: 10px 20px; font-size: 1.05rem;">
            RESET
          </button>
        </div>
      </div>
    `,document.getElementById("confirm-cancel-btn")?.addEventListener("click",()=>{d.playClick(),this.showStatsModal()}),document.getElementById("confirm-reset-btn")?.addEventListener("click",()=>{d.playClick(),p.resetStats(),this.showStatsModal()})}showAchievementsModal(){const t=p.getStats(),s=[{name:"First Trap Survived",desc:"Score your first point",done:t.bestScore>=1,icon:"🎯"},{name:"On Fire!",desc:"Reach a streak of 10x",done:t.bestStreak>=10,icon:"🔥"},{name:"Lightning Reflexes",desc:"Reaction time under 450ms",done:t.bestReactionTimeMs<=450,icon:"⚡"},{name:"Century Club",desc:"Score 100+ points in one run",done:t.bestScore>=100,icon:"👑"}].map(n=>`
      <div class="modal-row" style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">${n.icon}</span>
          <div>
            <div style="font-weight: 800; color: ${n.done?"#FFC400":"#8899B5"};">${n.name}</div>
            <div style="font-size: 0.8rem; color: #8899B5;">${n.desc}</div>
          </div>
        </div>
        <span style="font-size: 1.2rem;">${n.done?"✅":"🔒"}</span>
      </div>
    `).join("");this.container.innerHTML=`
      <div class="modal-card">
        <h2 class="modal-title">🏆 ACHIEVEMENTS</h2>
        <div style="width: 100%; max-height: 280px; overflow-y: auto;">
          ${s}
        </div>
        <button id="modal-close-achieve" class="btn-arcade btn-primary-yellow modal-close-btn" style="min-width: 180px; font-size: 1.2rem; padding: 10px 24px;">AWESOME</button>
      </div>
    `,this.container.classList.remove("hidden"),document.getElementById("modal-close-achieve")?.addEventListener("click",()=>{d.playClick(),this.close()})}showDailyRewardModal(){const t=p.canClaimDailyReward(),e=l.DAILY_REWARD_AMOUNT;t?(this.container.innerHTML=`
        <div class="modal-card">
          <h2 class="modal-title">🎁 DAILY REWARD</h2>
          <div style="font-size: 3.5rem; margin: 8px 0;">🎉</div>
          <p style="font-size: 1.1rem; color: #CCD8F5; margin-bottom: 14px;">
            Claim your Daily Arcade Focus Booster!
          </p>
          <div style="background: rgba(255, 184, 0, 0.15); border: 1px solid #FFB800; border-radius: 14px; padding: 12px 20px; color: #FFC400; font-weight: 800; margin-bottom: 20px; font-size: 1.25rem;">
            +${e} REWARD POINTS
          </div>
          <button id="modal-claim-reward-btn" class="btn-arcade btn-primary-yellow" style="min-width: 180px; font-size: 1.2rem; padding: 12px 28px;">
            COLLECT ▶
          </button>
        </div>
      `,this.container.classList.remove("hidden"),document.getElementById("modal-claim-reward-btn")?.addEventListener("click",()=>{if(this.isProcessingAction)return;this.isProcessingAction=!0,p.claimDailyReward().success?(d.playStreakMilestone(),this.container.innerHTML=`
            <div class="modal-card">
              <h2 class="modal-title" style="color: #14C834;">✅ REWARD COLLECTED!</h2>
              <div style="font-size: 3.5rem; margin: 8px 0;">💎</div>
              <p style="font-size: 1.15rem; color: #E2ECFF; margin-bottom: 12px;">
                You received <strong>+${e} Points</strong>!
              </p>
              <div style="color: #8E9FC2; font-size: 0.9rem; margin-bottom: 20px;">
                Come back tomorrow to collect again!
              </div>
              <button id="modal-claimed-close-btn" class="btn-arcade btn-primary-yellow" style="min-width: 160px; font-size: 1.15rem; padding: 10px 24px;">
                CONTINUE ▶
              </button>
            </div>
          `,document.getElementById("modal-claimed-close-btn")?.addEventListener("click",()=>{d.playClick(),this.isProcessingAction=!1,this.close()})):(this.isProcessingAction=!1,this.showDailyRewardModal())})):(this.container.innerHTML=`
        <div class="modal-card">
          <h2 class="modal-title">🎁 DAILY REWARD</h2>
          <div style="font-size: 3.2rem; margin: 8px 0; filter: grayscale(0.5);">⏳</div>
          <h3 style="color: #FFC400; font-size: 1.3rem; margin-bottom: 8px;">ALREADY COLLECTED TODAY!</h3>
          <p style="font-size: 1rem; color: #A0B2DC; margin-bottom: 20px; line-height: 1.4;">
            You have already claimed today's daily reward.<br/>
            Come back tomorrow to receive your next bonus!
          </p>
          <button id="modal-close-reward" class="btn-arcade btn-blue" style="min-width: 160px; font-size: 1.15rem; padding: 10px 24px;">
            GOT IT
          </button>
        </div>
      `,this.container.classList.remove("hidden"),document.getElementById("modal-close-reward")?.addEventListener("click",()=>{d.playClick(),this.close()}))}showShopModal(){const t=p.getRewardPoints(),s=l.SHOP_ITEMS.map(a=>{const o=p.isItemUnlocked(a.id);let r="";return o?r='<span class="shop-btn-action shop-btn-unlocked">UNLOCKED ✔</span>':t>=a.cost?r=`<button class="shop-btn-action shop-btn-buy" data-item-id="${a.id}" data-cost="${a.cost}">UNLOCK (${a.cost} PTS)</button>`:r=`<button class="shop-btn-action shop-btn-locked" data-item-id="${a.id}" data-cost="${a.cost}">LOCKED (${a.cost} PTS)</button>`,`
        <div class="shop-item-card">
          <div class="shop-item-left">
            <span style="font-size: 2rem;">${a.icon}</span>
            <div>
              <div class="shop-item-name">${a.name}</div>
              <div class="shop-item-desc">${a.desc}</div>
            </div>
          </div>
          <div>${r}</div>
        </div>
      `}).join("");this.container.innerHTML=`
      <div class="modal-card" style="max-width: 560px;">
        <h2 class="modal-title">🛒 ARCADE SHOP</h2>
        <div class="shop-balance-badge">
          <span>💎 Your Reward Points:</span>
          <strong id="shop-modal-points">${t}</strong>
        </div>
        <div id="shop-feedback-msg" style="display: none; padding: 8px 14px; border-radius: 8px; margin-bottom: 12px; font-weight: 700; font-size: 0.95rem;"></div>
        <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
          ${s}
        </div>
        <button id="modal-close-shop" class="btn-arcade btn-primary-yellow modal-close-btn" style="min-width: 160px; font-size: 1.15rem; padding: 10px 24px;">BACK</button>
      </div>
    `,this.container.classList.remove("hidden"),this.container.querySelectorAll(".shop-btn-buy").forEach(a=>{a.addEventListener("click",()=>{if(this.isProcessingAction)return;this.isProcessingAction=!0;const o=a.getAttribute("data-item-id");if(!o){this.isProcessingAction=!1;return}const r=p.purchaseShopItem(o);if(r.success){d.playStreakMilestone(),this.isProcessingAction=!1,this.showShopModal();const c=document.getElementById("shop-feedback-msg");c&&(c.style.display="block",c.style.background="rgba(20, 200, 52, 0.2)",c.style.color="#14C834",c.style.border="1px solid #14C834",c.textContent=r.message)}else{d.playWrong(),this.isProcessingAction=!1;const c=document.getElementById("shop-feedback-msg");c&&(c.style.display="block",c.style.background="rgba(255, 69, 87, 0.2)",c.style.color="#FF4557",c.style.border="1px solid #FF4557",c.textContent=r.message)}})}),this.container.querySelectorAll(".shop-btn-locked").forEach(a=>{a.addEventListener("click",()=>{d.playWrong();const o=parseInt(a.getAttribute("data-cost")||"0",10),r=Math.max(1,o-p.getRewardPoints()),c=document.getElementById("shop-feedback-msg");c&&(c.style.display="block",c.style.background="rgba(255, 69, 87, 0.2)",c.style.color="#FF4557",c.style.border="1px solid #FF4557",c.textContent=`NOT ENOUGH POINTS: Need ${r} more points (Cost: ${o} PTS).`)})}),document.getElementById("modal-close-shop")?.addEventListener("click",()=>{d.playClick(),this.close()})}close(){this.container.classList.add("hidden"),this.container.innerHTML="",this.isProcessingAction=!1}}const E=new D;class B{container=null;keydownHandler=null;storageUnsubscribe=null;onPlay;onHowToPlay;constructor(t){this.onPlay=t.onPlay,this.onHowToPlay=t.onHowToPlay}mount(t){this.container=t;const e=p.getBestScore(),s=p.getRewardPoints(),n=d.isSoundMuted();this.container.innerHTML=`
      <div class="screen-home">
        <!-- Top Header with Best Score and Reward Points -->
        <header class="home-header">
          <div class="home-header-left">
            <div class="badge-best-score" title="Your highest single-session score">
              <span class="label">👑 BEST SCORE</span>
              <span class="value" id="home-best-score-val">${e}</span>
            </div>
            <div class="badge-reward-points" title="Total Reward Points balance">
              <span class="label">💎 REWARD POINTS</span>
              <span class="value" id="home-reward-points-val">${s}</span>
            </div>
            <button id="btn-home-difficulty" class="badge-difficulty-select" title="Click to Change Difficulty Mode">
              <span>⚡ MODE:</span>
              <span class="val-diff" id="home-difficulty-val">${p.getSettings().difficulty}</span>
            </button>
          </div>

          <div class="home-header-right">
            <button id="home-btn-audio" class="btn-circle-icon" aria-label="Toggle Sound" title="Sound Mute/Unmute">
              <span id="audio-icon-span" style="font-size: 1.4rem;">${n?"🔇":"🔊"}</span>
            </button>
            <button id="home-btn-settings" class="btn-circle-icon" aria-label="Open Settings" title="Settings">
              <span style="font-size: 1.4rem;">⚙️</span>
            </button>
          </div>
        </header>

        <!-- Center Brand & CTA -->
        <main class="home-center">
          <div class="brand-logo-container">
            <div class="brand-splash-fx">
              <svg viewBox="0 0 500 320" style="width: 100%; height: 100%; overflow: visible;" fill="none">
                <!-- Top Blue Splatter -->
                <path d="M250,50 C230,10 210,0 190,15 C170,30 200,50 180,65 C160,80 140,70 120,95 C140,110 170,100 200,110 C230,120 270,110 300,100 C340,90 350,50 330,30 C310,10 280,30 250,50 Z" fill="#0088FF" opacity="0.95"/>
                <circle cx="210" cy="10" r="8" fill="#0088FF" />
                <circle cx="280" cy="5" r="10" fill="#00C8FF" />
                <circle cx="345" cy="20" r="7" fill="#0088FF" />

                <!-- Left Red/Orange Splatter -->
                <path d="M140,110 C90,80 60,95 40,120 C20,150 50,180 30,210 C10,240 30,270 70,270 C100,270 120,240 140,220 C160,200 170,150 140,110 Z" fill="#FF1A38" opacity="0.95"/>
                <circle cx="25" cy="115" r="9" fill="#FF1A38" />
                <circle cx="15" cy="180" r="11" fill="#FF6D1B" />
                <circle cx="45" cy="250" r="8" fill="#FF1A38" />

                <!-- Right Green Splatter -->
                <path d="M360,110 C410,80 440,95 460,120 C480,150 450,180 470,210 C490,240 470,270 430,270 C400,270 380,240 360,220 C340,200 330,150 360,110 Z" fill="#14C834" opacity="0.95"/>
                <circle cx="475" cy="115" r="9" fill="#14C834" />
                <circle cx="485" cy="180" r="11" fill="#FFB800" />
                <circle cx="455" cy="250" r="8" fill="#14C834" />

                <!-- Bottom Purple/Magenta Splatter -->
                <path d="M180,220 C150,250 170,290 200,300 C240,310 270,310 310,295 C340,280 340,250 320,230 C300,210 270,220 250,220 C220,220 200,200 180,220 Z" fill="#A23DF5" opacity="0.9"/>
                <circle cx="210" cy="315" r="9" fill="#A23DF5" />
                <circle cx="295" cy="310" r="10" fill="#FF2680" />
              </svg>
            </div>
            <div class="brand-splatters-wrap">
              <div class="brand-title">
                <div class="brand-color-row">
                  <span class="letter-c">C</span>
                  <span class="letter-o1">O</span>
                  <span class="letter-l">L</span>
                  <span class="letter-o2">O</span>
                  <span class="letter-r">R</span>
                </div>
                <div class="brand-trap-row">
                  <span>T</span>
                  <span>R</span>
                  <span class="trap-letter-a">
                    A
                    <svg class="trap-warning-icon" viewBox="0 0 24 24" fill="none">
                      <polygon points="12,3 22,21 2,21" fill="#FFC400" stroke="#000000" stroke-width="2"/>
                      <circle cx="12" cy="17" r="1.5" fill="#000000"/>
                      <line x1="12" y1="8" x2="12" y2="13" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                  </span>
                  <span>P</span>
                </div>
              </div>
              <div class="brand-tagline">
                <span class="part-white">DON'T READ IT.</span>
                <span class="part-yellow">SEE IT.</span>
              </div>
            </div>
          </div>

          <div class="home-actions-primary">
            <button id="btn-home-play" class="btn-arcade btn-primary-yellow">
              PLAY ▶
            </button>
          </div>

          <!-- Secondary Actions including STATS, HOW TO PLAY, ACHIEVEMENTS -->
          <div class="home-actions-secondary">
            <button id="btn-home-howto" class="btn-arcade btn-purple">
              📖 HOW TO PLAY
            </button>
            <button id="btn-home-stats" class="btn-arcade btn-blue">
              📊 STATS
            </button>
            <button id="btn-home-achieve" class="btn-arcade btn-purple">
              🏆 ACHIEVEMENTS
            </button>
          </div>
        </main>

        <!-- Bottom Footer -->
        <footer class="home-footer">
          <div class="shop-btn-wrap">
            <button id="btn-home-shop" class="btn-circle-icon" aria-label="Arcade Shop" title="Arcade Shop">
              <span style="font-size: 1.4rem;">🛒</span>
            </button>
            <span class="shop-btn-label">SHOP</span>
          </div>

          <div class="keyboard-hint-bar" aria-label="Keyboard Shortcut Hints">
            <span>⌨️ KEYBOARD:</span>
            <span class="key-badge key-badge-1">1</span>
            <span class="key-badge key-badge-2">2</span>
            <span class="key-badge key-badge-3">3</span>
            <span class="key-badge key-badge-4">4</span>
          </div>

          <div id="btn-home-reward" class="daily-reward-box" title="Claim Daily Reward">
            <div style="font-size: 2.8rem; line-height: 1; filter: drop-shadow(0 4px 10px rgba(168, 54, 245, 0.7));">🎁</div>
            <span class="daily-reward-btn">DAILY REWARD</span>
          </div>
        </footer>
      </div>
    `,document.getElementById("btn-home-play")?.addEventListener("click",()=>{d.playClick(),this.onPlay()}),document.getElementById("btn-home-howto")?.addEventListener("click",()=>{d.playClick(),this.onHowToPlay()}),document.getElementById("btn-home-stats")?.addEventListener("click",()=>{d.playClick(),E.showStatsModal()}),document.getElementById("btn-home-achieve")?.addEventListener("click",()=>{d.playClick(),E.showAchievementsModal()}),document.getElementById("home-btn-audio")?.addEventListener("click",()=>{const i=d.toggleSound(),a=document.getElementById("audio-icon-span");a&&(a.textContent=i?"🔊":"🔇")}),document.getElementById("home-btn-settings")?.addEventListener("click",()=>{d.playClick(),E.showSettingsModal(i=>{const a=document.getElementById("audio-icon-span");a&&(a.textContent=i?"🔊":"🔇")})}),document.getElementById("btn-home-shop")?.addEventListener("click",()=>{d.playClick(),E.showShopModal()}),document.getElementById("btn-home-reward")?.addEventListener("click",()=>{d.playClick(),E.showDailyRewardModal()}),document.getElementById("btn-home-difficulty")?.addEventListener("click",()=>{d.playClick();const i=p.getSettings().difficulty,a=["NORMAL","HARD","VERY HARD","EASY"],o=a.indexOf(i),r=a[(o+1)%a.length];p.saveSettings({difficulty:r})}),this.storageUnsubscribe=p.subscribe(()=>{this.updateBadges()}),this.keydownHandler=i=>{i.code==="Space"||i.code==="Enter"?(i.preventDefault(),d.playClick(),this.onPlay()):i.key.toLowerCase()==="h"?(d.playClick(),this.onHowToPlay()):i.key.toLowerCase()==="s"&&(d.playClick(),E.showStatsModal())},window.addEventListener("keydown",this.keydownHandler)}updateBadges(){const t=document.getElementById("home-best-score-val");t&&(t.textContent=p.getBestScore().toString());const e=document.getElementById("home-reward-points-val");e&&(e.textContent=p.getRewardPoints().toString());const s=document.getElementById("home-difficulty-val");s&&(s.textContent=p.getSettings().difficulty)}unmount(){this.storageUnsubscribe&&(this.storageUnsubscribe(),this.storageUnsubscribe=null),this.keydownHandler&&(window.removeEventListener("keydown",this.keydownHandler),this.keydownHandler=null),this.container&&(this.container.innerHTML="",this.container=null)}}class N{container=null;keydownHandler=null;onBack;onGotIt;constructor(t){this.onBack=t.onBack,this.onGotIt=t.onGotIt}mount(t){this.container=t,this.container.innerHTML=`
      <div class="screen-instructions">
        <!-- Top Header -->
        <header class="instructions-header">
          <button id="btn-inst-back" class="btn-back">
            <span>⬅</span>
            <span>BACK</span>
          </button>

          <div class="instructions-header-center brand-logo-compact">
            <div class="brand-color-row">
              <span class="letter-c">C</span>
              <span class="letter-o1">O</span>
              <span class="letter-l">L</span>
              <span class="letter-o2">O</span>
              <span class="letter-r">R</span>
            </div>
            <div class="brand-trap-row">
              <span>T</span>
              <span>R</span>
              <span class="trap-letter-a">
                A
                <svg class="trap-warning-icon" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,3 22,21 2,21" fill="#FFC400" stroke="#000000" stroke-width="2"/>
                  <circle cx="12" cy="17" r="1.5" fill="#000000"/>
                  <line x1="12" y1="8" x2="12" y2="13" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </span>
              <span>P</span>
            </div>
            <div class="brand-tagline">
              <span class="part-white">DON'T READ IT.</span>
              <span class="part-yellow">SEE IT.</span>
            </div>
            <div class="how-to-play-badge">
              <span>★</span>
              <span>HOW TO PLAY</span>
              <span>★</span>
            </div>
          </div>

          <div style="width: 80px;"></div> <!-- Spacer to balance header -->
        </header>

        <!-- 2-Column Instructions Card -->
        <main class="card-arcade instructions-card">
          <!-- Left Column: Steps -->
          <div class="instructions-steps-list">
            <div class="step-item">
              <div class="step-icon-bubble step-bubble-1">👁️</div>
              <div class="step-text">
                <span class="step-title">1. SEE THE <span class="highlight-color">COLOR</span></span>
                <span class="step-desc">Look at the COLOR the word is written in.</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-icon-bubble step-bubble-2">🧠</div>
              <div class="step-text">
                <span class="step-title">2. IGNORE THE WORD</span>
                <span class="step-desc">The word is the trap. Don't read it!</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-icon-bubble step-bubble-3">👆</div>
              <div class="step-text">
                <span class="step-title">3. TAP THE MATCH</span>
                <span class="step-desc">Tap the button that matches the COLOR, not the word.</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-icon-bubble step-bubble-4">⚡</div>
              <div class="step-text">
                <span class="step-title">4. GO FAST & STAY FOCUSED</span>
                <span class="step-desc">The timer is running! Build streaks and get a high score.</span>
              </div>
            </div>
          </div>

          <!-- Vertical Divider -->
          <div class="instructions-divider"></div>

          <!-- Right Column: Interactive Example -->
          <div class="instructions-example-box">
            <div class="example-ribbon">EXAMPLE</div>

            <div class="example-word-trap">
              BLUE
            </div>

            <p class="example-question">Which color is the word written in?</p>

            <div class="example-buttons-grid" style="position: relative;">
              <button id="demo-btn-red" class="btn-arcade btn-answer-red example-btn" style="box-shadow: var(--shadow-btn-red);">
                RED
              </button>
              <button id="demo-btn-blue" class="btn-arcade btn-answer-blue example-btn example-btn-active">
                BLUE
              </button>
              <button id="demo-btn-green" class="btn-arcade btn-answer-green example-btn" style="box-shadow: var(--shadow-btn-green);">
                GREEN
              </button>
              <button id="demo-btn-yellow" class="btn-arcade btn-answer-yellow example-btn" style="box-shadow: var(--shadow-btn-yellow);">
                YELLOW
              </button>

              <!-- Curved Indicator Arrow pointing to correct match (BLUE button) -->
              <svg class="example-pointer-arrow" viewBox="0 0 40 50" fill="none">
                <path d="M5,45 Q35,40 25,12" stroke="#14C834" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                <polygon points="20,10 32,10 28,22" fill="#14C834"/>
              </svg>
            </div>

            <div class="example-correct-badge">
              <span>✔</span>
              <span>Correct Answer: <strong>BLUE</strong></span>
            </div>
          </div>
        </main>

        <!-- Bottom Bar -->
        <footer class="instructions-bottom-bar">
          <div class="instructions-tip-pill">
            <span style="font-size: 1.3rem;">💡</span>
            <span><strong class="tip-bold">TIP:</strong> Trust your eyes, not your brain. You know the color!</span>
          </div>

          <button id="btn-inst-gotit" class="btn-arcade btn-got-it">
            GOT IT!
          </button>
        </footer>
      </div>
    `,document.getElementById("btn-inst-back")?.addEventListener("click",()=>{d.playClick(),this.onBack()}),document.getElementById("btn-inst-gotit")?.addEventListener("click",()=>{d.playClick(),this.onGotIt()}),document.getElementById("demo-btn-blue")?.addEventListener("click",()=>{d.playCorrect(3)}),document.getElementById("demo-btn-red")?.addEventListener("click",()=>{d.playWrong()}),document.getElementById("demo-btn-green")?.addEventListener("click",()=>{d.playWrong()}),document.getElementById("demo-btn-yellow")?.addEventListener("click",()=>{d.playWrong()}),this.keydownHandler=e=>{e.code==="Space"||e.code==="Enter"?(e.preventDefault(),d.playClick(),this.onGotIt()):(e.code==="Escape"||e.key==="Backspace")&&(e.preventDefault(),d.playClick(),this.onBack())},window.addEventListener("keydown",this.keydownHandler)}unmount(){this.keydownHandler&&(window.removeEventListener("keydown",this.keydownHandler),this.keydownHandler=null),this.container&&(this.container.innerHTML="",this.container=null)}}class F{metrics;durationSec=l.SESSION_DURATION_SEC;remainingTimeMs=l.SESSION_DURATION_SEC*1e3;timerInterval=null;lastTickTimestamp=0;isPaused=!1;isActive=!1;onUpdate=null;onEnd=null;constructor(t="NORMAL"){const e=t==="HARD"||t==="VERY HARD";this.metrics={score:0,correctAnswers:0,wrongAnswers:0,currentStreak:0,maxStreak:0,totalReactionTimeMs:0,reactionTimes:[],bestReactionTimeMs:0,accuracyPercent:100,averageReactionTimeMs:0,sessionDurationSec:l.SESSION_DURATION_SEC,hardMode:e,difficulty:t,rewardPointsEarned:0}}start(t,e){this.stop(),this.onUpdate=t,this.onEnd=e,this.remainingTimeMs=this.durationSec*1e3,this.isActive=!0,this.isPaused=!1,this.lastTickTimestamp=performance.now(),this.timerInterval=window.setInterval(()=>{if(this.isPaused||!this.isActive)return;const s=performance.now(),n=s-this.lastTickTimestamp;this.lastTickTimestamp=s,this.remainingTimeMs-=n,this.remainingTimeMs<=0?(this.remainingTimeMs=0,this.stop(),this.onUpdate&&this.onUpdate(this.getMetrics(),0),this.onEnd&&this.onEnd(this.getMetrics())):this.onUpdate&&this.onUpdate(this.getMetrics(),Math.ceil(this.remainingTimeMs/1e3))},100)}pause(){!this.isActive||this.isPaused||(this.isPaused=!0)}resume(){!this.isActive||!this.isPaused||(this.isPaused=!1,this.lastTickTimestamp=performance.now())}recordAnswer(t,e){if(!this.isActive)return{pointsAwarded:0,speedBonus:0,streakMilestoneReached:!1};let s=0,n=0,i=!1;this.metrics.reactionTimes.push(e),this.metrics.totalReactionTimeMs+=e,this.metrics.averageReactionTimeMs=Math.round(this.metrics.totalReactionTimeMs/this.metrics.reactionTimes.length),(this.metrics.bestReactionTimeMs===0||e<this.metrics.bestReactionTimeMs)&&(this.metrics.bestReactionTimeMs=Math.round(e)),t?(this.metrics.correctAnswers+=1,this.metrics.rewardPointsEarned+=1,p.awardCorrectAnswerPoint(),this.metrics.currentStreak+=1,this.metrics.currentStreak>this.metrics.maxStreak&&(this.metrics.maxStreak=this.metrics.currentStreak),l.STREAK_MILESTONES.includes(this.metrics.currentStreak)&&(i=!0,d.playStreakMilestone()),s+=l.BASE_SCORE,e<l.SPEED_BONUS_TIER_1_MS?n=3:e<l.SPEED_BONUS_TIER_2_MS?n=2:e<l.SPEED_BONUS_TIER_3_MS&&(n=1),s+=n,this.metrics.score+=s):(this.metrics.wrongAnswers+=1,this.metrics.currentStreak=0);const a=this.metrics.correctAnswers+this.metrics.wrongAnswers;return this.metrics.accuracyPercent=a>0?Math.round(this.metrics.correctAnswers/a*100):100,{pointsAwarded:s,speedBonus:n,streakMilestoneReached:i}}getMetrics(){return{...this.metrics}}getRemainingSeconds(){return Math.max(0,Math.ceil(this.remainingTimeMs/1e3))}getElapsedSeconds(){return Math.min(this.durationSec,this.durationSec-this.remainingTimeMs/1e3)}stop(){this.timerInterval!==null&&(clearInterval(this.timerInterval),this.timerInterval=null),this.isActive=!1,this.isPaused=!1}reset(t){this.stop();const e=t!==void 0?t:this.metrics.difficulty,s=e==="HARD"||e==="VERY HARD";this.metrics={score:0,correctAnswers:0,wrongAnswers:0,currentStreak:0,maxStreak:0,totalReactionTimeMs:0,reactionTimes:[],bestReactionTimeMs:0,accuracyPercent:100,averageReactionTimeMs:0,sessionDurationSec:l.SESSION_DURATION_SEC,hardMode:s,difficulty:e,rewardPointsEarned:0},this.remainingTimeMs=this.durationSec*1e3,this.lastTickTimestamp=0}finalize(){return this.stop(),p.recordGameCompletion({score:this.metrics.score,streak:this.metrics.maxStreak,correct:this.metrics.correctAnswers,wrong:this.metrics.wrongAnswers,totalReactionTimeMs:this.metrics.totalReactionTimeMs,bestReactionTimeMs:this.metrics.bestReactionTimeMs})}}function m(h){const t=[...h];for(let e=t.length-1;e>0;e--){const s=Math.floor(Math.random()*(e+1));[t[e],t[s]]=[t[s],t[e]]}return t}function f(h){return h[Math.floor(Math.random()*h.length)]}function g(h){return l.COLORS.find(t=>t.id===h)||l.COLORS[0]}const v={type:"WORD_TRAP",generate:()=>{const t=m([...l.PRIMARY_COLOR_IDS]).slice(0,4),e=f(t),s=g(e),n=t.filter(r=>r!==e),i=f(n),a=g(i),o=t.map(r=>{const c=g(r);return{id:r,label:c.name,colorId:r,isCorrect:r===e}});return{id:`word_${Date.now()}_${Math.random()}`,type:"WORD_TRAP",question:"What color is the word written in?",targetProperty:s.name,distractorProperty:a.name,stimulus:{type:"WORD_TRAP",primaryText:a.name,textColor:s.hex},options:m(o),correctAnswerId:e,startTime:performance.now()}}},T={type:"SHAPE_TRAP",generate:()=>{if(Math.random()>.5){const e=m([...l.PRIMARY_COLOR_IDS]).slice(0,4),s=f(e),n=g(s),i=f(l.SHAPES),a=e.map(o=>{const r=g(o);return{id:o,label:r.name,colorId:o,isCorrect:o===s}});return{id:`shape_color_${Date.now()}_${Math.random()}`,type:"SHAPE_TRAP",question:"What color is the shape?",targetProperty:n.name,distractorProperty:i,stimulus:{type:"SHAPE_TRAP",shapeId:i,shapeColor:n.hex},options:m(a),correctAnswerId:s,startTime:performance.now()}}else{const e=m([...l.SHAPES]).slice(0,4),s=f(e),n=f(l.PRIMARY_COLOR_IDS),i=g(n),a=e.map(o=>({id:o,label:o.toUpperCase(),shapeId:o,isCorrect:o===s}));return{id:`shape_name_${Date.now()}_${Math.random()}`,type:"SHAPE_TRAP",question:"Which shape is shown?",targetProperty:s,distractorProperty:i.name,stimulus:{type:"SHAPE_TRAP",shapeId:s,shapeColor:i.hex},options:m(a),correctAnswerId:s,startTime:performance.now()}}}},C={type:"ICON_TRAP",generate:()=>{if(Math.random()>.5){const e=m([...l.PRIMARY_COLOR_IDS]).slice(0,4),s=f(e),n=g(s),i=f(l.ICONS),a=e.map(o=>{const r=g(o);return{id:o,label:r.name,colorId:o,isCorrect:o===s}});return{id:`icon_color_${Date.now()}_${Math.random()}`,type:"ICON_TRAP",question:"What color is the icon?",targetProperty:n.name,distractorProperty:i,stimulus:{type:"ICON_TRAP",iconId:i,iconColor:n.hex},options:m(a),correctAnswerId:s,startTime:performance.now()}}else{const e=m([...l.ICONS]).slice(0,4),s=f(e),n=f(l.PRIMARY_COLOR_IDS),i=g(n),a=e.map(o=>({id:o,label:o.toUpperCase(),iconId:o,isCorrect:o===s}));return{id:`icon_name_${Date.now()}_${Math.random()}`,type:"ICON_TRAP",question:"Which icon is shown?",targetProperty:s,distractorProperty:i.name,stimulus:{type:"ICON_TRAP",iconId:s,iconColor:i.hex},options:m(a),correctAnswerId:s,startTime:performance.now()}}}},R={type:"SIZE_TRAP",generate:()=>{const h=m([...l.PRIMARY_COLOR_IDS]),t=["small","medium","large"],e=Math.random()>.5,s=t.map((o,r)=>({id:`elem_${r}`,shapeId:"circle",color:g(h[r]).hex,colorId:h[r],size:o})),n=e?s.find(o=>o.size==="large"):s.find(o=>o.size==="small"),i=g(n.colorId),a=h.slice(0,3).map(o=>{const r=g(o);return{id:o,label:r.name,colorId:o,isCorrect:o===n.colorId}});return{id:`size_${Date.now()}_${Math.random()}`,type:"SIZE_TRAP",question:e?"Which color is the LARGEST circle?":"Which color is the SMALLEST circle?",targetProperty:i.name,distractorProperty:e?"small":"large",stimulus:{type:"SIZE_TRAP",additionalElements:m(s).map(o=>({id:o.id,shapeId:o.shapeId,color:o.color,size:o.size}))},options:m(a),correctAnswerId:n.colorId,startTime:performance.now()}}},k={type:"POSITION_TRAP",generate:()=>{const h=["top-left","top-right","bottom-left","bottom-right"],t=m([...l.PRIMARY_COLOR_IDS]),e=h.map((n,i)=>({id:`pos_${i}`,shapeId:"circle",color:g(t[i]).hex,colorId:t[i],position:n}));if(Math.random()>.5){const n=f(e),i=g(n.colorId),a=n.position.replace("-"," ").toUpperCase(),o=t.map(r=>{const c=g(r);return{id:r,label:c.name,colorId:r,isCorrect:r===n.colorId}});return{id:`pos_color_${Date.now()}_${Math.random()}`,type:"POSITION_TRAP",question:`What color is in the ${a}?`,targetProperty:i.name,distractorProperty:n.position,stimulus:{type:"POSITION_TRAP",additionalElements:e},options:m(o),correctAnswerId:n.colorId,startTime:performance.now()}}else{const n=f(e),i=g(n.colorId),a=h.map(o=>({id:o,label:o.replace("-"," ").toUpperCase(),isCorrect:o===n.position}));return{id:`pos_name_${Date.now()}_${Math.random()}`,type:"POSITION_TRAP",question:`Where is the ${i.name} circle?`,targetProperty:n.position,distractorProperty:i.name,stimulus:{type:"POSITION_TRAP",additionalElements:e},options:m(a),correctAnswerId:n.position,startTime:performance.now()}}}},I={type:"PATTERN_TRAP",generate:()=>{const h=Math.random()>.5,t=m([...l.PATTERNS]),e=f(t),s=m([...l.PRIMARY_COLOR_IDS]),n=f(s),i=g(n);if(h){const a=t.map(o=>({id:o,label:o.toUpperCase(),isCorrect:o===e}));return{id:`pat_name_${Date.now()}_${Math.random()}`,type:"PATTERN_TRAP",question:"Which pattern is shown?",targetProperty:e,distractorProperty:i.name,stimulus:{type:"PATTERN_TRAP",shapeId:"square",shapeColor:i.hex,patternId:e},options:m(a),correctAnswerId:e,startTime:performance.now()}}else{const a=s.map(o=>{const r=g(o);return{id:o,label:r.name,colorId:o,isCorrect:o===n}});return{id:`pat_color_${Date.now()}_${Math.random()}`,type:"PATTERN_TRAP",question:"What color is the pattern?",targetProperty:i.name,distractorProperty:e,stimulus:{type:"PATTERN_TRAP",shapeId:"square",shapeColor:i.hex,patternId:e},options:m(a),correctAnswerId:n,startTime:performance.now()}}}},M={type:"MIXED_TRAP",generate:()=>{const h=Math.random(),t=h<.4?"color":h<.7?"shape":"pattern",e=m([...l.PRIMARY_COLOR_IDS]),s=e[0],n=g(s),i=m([...l.SHAPES]),a=i[0],o=m([...l.PATTERNS]),r=o[0];let c="",u="",S="",w=[],b="";return t==="color"?(c="What COLOR is this shape?",u=n.name,S=`${a} with ${r}`,w=e.slice(0,4).map(y=>{const _=g(y);return{id:y,label:_.name,colorId:y,isCorrect:y===s}}),b=s):t==="shape"?(c="Which SHAPE is shown?",u=a,S=`${n.name} with ${r}`,w=i.slice(0,4).map(y=>({id:y,label:y.toUpperCase(),shapeId:y,isCorrect:y===a})),b=a):(c="Which PATTERN is on the shape?",u=r,S=`${n.name} ${a}`,w=o.slice(0,4).map(y=>({id:y,label:y.toUpperCase(),isCorrect:y===r})),b=r),{id:`mixed_${Date.now()}_${Math.random()}`,type:"MIXED_TRAP",question:c,targetProperty:u,distractorProperty:S,stimulus:{type:"MIXED_TRAP",shapeId:a,shapeColor:n.hex,patternId:r},options:m(w),correctAnswerId:b,startTime:performance.now()}}};class H{hardMode=!1;lastType=null;constructor(t=!1){this.hardMode=t}setHardMode(t){this.hardMode=t}generateNext(t){let e=[v];this.hardMode?e=[v,v,T,C,R,k,I,M,M]:t<18?e=[v,v,v,T]:t<36?e=[v,T,C,R]:t<48?e=[v,I,k,C]:e=[v,M,I,R,T];let s=e.filter(i=>i.type!==this.lastType);s.length===0&&(s=e);const n=f(s);return this.lastType=n.type,n.generate(Math.floor(t/15)+(this.hardMode?2:0))}}class ${isInitialized=!1;constructor(){this.checkInit()}checkInit(){typeof window<"u"&&window.CrazyGames?.SDK&&(this.isInitialized=!0)}gameplayStart(){this.checkInit();try{this.isInitialized&&window.CrazyGames?.SDK?.game?.gameplayStart&&window.CrazyGames.SDK.game.gameplayStart()}catch{}}gameplayStop(){this.checkInit();try{this.isInitialized&&window.CrazyGames?.SDK?.game?.gameplayStop&&window.CrazyGames.SDK.game.gameplayStop()}catch{}}happytime(){this.checkInit();try{this.isInitialized&&window.CrazyGames?.SDK?.game?.happytime&&window.CrazyGames.SDK.game.happytime()}catch{}}}const x=new $;class G{element;circleProgress=null;timeText=null;totalDuration=60;radius=30;circumference=2*Math.PI*30;constructor(t=60){this.totalDuration=t,this.element=document.createElement("div"),this.element.className="timer-radial-wrap",this.render()}getElement(){return this.element}render(){this.element.innerHTML=`
      <svg class="timer-svg" width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
        <circle class="timer-circle-bg" cx="38" cy="38" r="${this.radius}" stroke-width="5" fill="none" />
        <circle class="timer-circle-progress" cx="38" cy="38" r="${this.radius}" stroke-width="5" fill="none"
          stroke-dasharray="${this.circumference}" stroke-dashoffset="0" stroke-linecap="round" />
      </svg>
      <div class="timer-content-text">
        <span class="timer-label">TIME LEFT</span>
        <span class="timer-number">${this.totalDuration}s</span>
      </div>
    `,this.circleProgress=this.element.querySelector(".timer-circle-progress"),this.timeText=this.element.querySelector(".timer-number")}update(t){if(this.timeText&&(this.timeText.textContent=`${t}s`),this.circleProgress){const e=Math.max(0,Math.min(1,t/this.totalDuration)),s=this.circumference*(1-e);this.circleProgress.style.strokeDashoffset=`${s}`,t<=10?this.circleProgress.classList.add("timer-circle-low"):this.circleProgress.classList.remove("timer-circle-low")}}}class U{element;fillElement=null;flameElement=null;maxCap=20;constructor(){this.element=document.createElement("div"),this.element.className="gameplay-intensity-bar-wrap",this.render()}getElement(){return this.element}render(){this.element.innerHTML=`
      <div class="intensity-track">
        <div class="intensity-fill"></div>
      </div>
      <div class="intensity-flame-icon">🔥</div>
    `,this.fillElement=this.element.querySelector(".intensity-fill"),this.flameElement=this.element.querySelector(".intensity-flame-icon")}update(t){if(this.fillElement){const e=Math.min(100,Math.round(t/this.maxCap*100));this.fillElement.style.width=`${e}%`}this.flameElement&&(t>=10?this.flameElement.style.transform="scale(1.3)":t>=5?this.flameElement.style.transform="scale(1.15)":this.flameElement.style.transform="scale(1)")}}class Y{static render(t,e){switch(e.innerHTML="",t.type){case"WORD_TRAP":this.renderWord(t,e);break;case"SHAPE_TRAP":this.renderShape(t,e);break;case"ICON_TRAP":this.renderIcon(t,e);break;case"SIZE_TRAP":this.renderSize(t,e);break;case"POSITION_TRAP":this.renderPosition(t,e);break;case"PATTERN_TRAP":case"MIXED_TRAP":this.renderPatternOrMixed(t,e);break;default:this.renderWord(t,e)}}static renderWord(t,e){const s=document.createElement("div");s.className="stimulus-word",s.textContent=t.primaryText||"",s.style.color=t.textColor||"#FFFFFF",e.appendChild(s)}static renderShape(t,e){const s=t.shapeId||"circle",n=t.shapeColor||"#FF2238",i=this.createShapeSvg(s,n,110,110);e.appendChild(i)}static renderIcon(t,e){const s=t.iconId||"star",n=t.iconColor||"#FFB800",i=this.createIconSvg(s,n,100,100);e.appendChild(i)}static renderSize(t,e){const s=document.createElement("div");s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.gap="24px";const n={small:38,medium:62,large:92};t.additionalElements?.forEach(i=>{const a=n[i.size||"medium"],o=this.createShapeSvg("circle",i.color,a,a);s.appendChild(o)}),e.appendChild(s)}static renderPosition(t,e){const s=document.createElement("div");s.style.display="grid",s.style.gridTemplateColumns="1fr 1fr",s.style.gap="14px",s.style.padding="8px",s.style.background="rgba(255, 255, 255, 0.04)",s.style.borderRadius="16px",["top-left","top-right","bottom-left","bottom-right"].forEach(i=>{const a=t.additionalElements?.find(c=>c.position===i),o=a?a.color:"#888888",r=this.createShapeSvg("circle",o,42,42);s.appendChild(r)}),e.appendChild(s)}static renderPatternOrMixed(t,e){const s=t.shapeId||"square",n=t.shapeColor||"#FFB800",i=t.patternId||"stripes",a=this.createPatternedSvg(s,n,i,110,110);e.appendChild(a)}static createShapeSvg(t,e,s,n){const i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("width",`${s}`),i.setAttribute("height",`${n}`),i.setAttribute("viewBox","0 0 100 100"),i.style.filter=`drop-shadow(0 4px 10px ${e}88)`;let a="";if(t==="circle"){const r=document.createElementNS("http://www.w3.org/2000/svg","circle");return r.setAttribute("cx","50"),r.setAttribute("cy","50"),r.setAttribute("r","42"),r.setAttribute("fill",e),i.appendChild(r),i}else if(t==="square"){const r=document.createElementNS("http://www.w3.org/2000/svg","rect");return r.setAttribute("x","10"),r.setAttribute("y","10"),r.setAttribute("width","80"),r.setAttribute("height","80"),r.setAttribute("rx","14"),r.setAttribute("fill",e),i.appendChild(r),i}else t==="triangle"?a="M50,12 L88,84 L12,84 Z":t==="star"?a="M50,8 L61,38 L94,38 L67,58 L77,88 L50,69 L23,88 L33,58 L6,38 L39,38 Z":t==="diamond"&&(a="M50,8 L88,50 L50,92 L12,50 Z");const o=document.createElementNS("http://www.w3.org/2000/svg","path");return o.setAttribute("d",a),o.setAttribute("fill",e),i.appendChild(o),i}static createIconSvg(t,e,s,n){const i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("width",`${s}`),i.setAttribute("height",`${n}`),i.setAttribute("viewBox","0 0 100 100"),i.style.filter=`drop-shadow(0 4px 10px ${e}88)`;let a="";if(t==="heart")a="M50,85 C20,60 10,40 10,25 C10,12 20,6 32,6 C40,6 46,10 50,16 C54,10 60,6 68,6 C80,6 90,12 90,25 C90,40 80,60 50,85 Z";else if(t==="lightning")a="M56,8 L24,52 L48,52 L42,92 L76,46 L52,46 Z";else if(t==="target"){const r=document.createElementNS("http://www.w3.org/2000/svg","g");return r.innerHTML=`
        <circle cx="50" cy="50" r="42" stroke="${e}" stroke-width="8" fill="none" />
        <circle cx="50" cy="50" r="24" stroke="${e}" stroke-width="8" fill="none" />
        <circle cx="50" cy="50" r="8" fill="${e}" />
      `,i.appendChild(r),i}else t==="flame"?a="M50,10 C50,10 65,30 65,45 C65,55 58,62 50,62 C42,62 35,55 35,45 C35,32 45,22 50,10 Z M50,92 C25,92 15,72 15,55 C15,38 30,25 30,25 C30,25 28,40 38,48 C38,48 42,32 58,32 C58,45 68,52 68,65 C68,78 58,92 50,92 Z":a="M50,8 L61,38 L94,38 L67,58 L77,88 L50,69 L23,88 L33,58 L6,38 L39,38 Z";const o=document.createElementNS("http://www.w3.org/2000/svg","path");return o.setAttribute("d",a),o.setAttribute("fill",e),i.appendChild(o),i}static createPatternedSvg(t,e,s,n,i){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("width",`${n}`),a.setAttribute("height",`${i}`),a.setAttribute("viewBox","0 0 100 100");const o=document.createElementNS("http://www.w3.org/2000/svg","defs"),r=`pat_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,c=document.createElementNS("http://www.w3.org/2000/svg","pattern");c.setAttribute("id",r),c.setAttribute("patternUnits","userSpaceOnUse"),s==="stripes"?(c.setAttribute("width","16"),c.setAttribute("height","16"),c.setAttribute("patternTransform","rotate(45)"),c.innerHTML=`
        <rect width="16" height="16" fill="${e}" />
        <line x1="0" y1="0" x2="0" y2="16" stroke="#FFFFFF" stroke-width="6" />
      `):s==="dots"?(c.setAttribute("width","16"),c.setAttribute("height","16"),c.innerHTML=`
        <rect width="16" height="16" fill="${e}" />
        <circle cx="8" cy="8" r="4" fill="#FFFFFF" />
      `):s==="waves"?(c.setAttribute("width","20"),c.setAttribute("height","10"),c.innerHTML=`
        <rect width="20" height="10" fill="${e}" />
        <path d="M0,5 Q5,0 10,5 T20,5" stroke="#FFFFFF" stroke-width="3" fill="none" />
      `):(c.setAttribute("width","10"),c.setAttribute("height","10"),c.innerHTML=`<rect width="10" height="10" fill="${e}" />`),o.appendChild(c),a.appendChild(o);let u;return t==="circle"?(u=document.createElementNS("http://www.w3.org/2000/svg","circle"),u.setAttribute("cx","50"),u.setAttribute("cy","50"),u.setAttribute("r","42")):(u=document.createElementNS("http://www.w3.org/2000/svg","rect"),u.setAttribute("x","10"),u.setAttribute("y","10"),u.setAttribute("width","80"),u.setAttribute("height","80"),u.setAttribute("rx","14")),u.setAttribute("fill",`url(#${r})`),u.setAttribute("stroke","rgba(255,255,255,0.4)"),u.setAttribute("stroke-width","2"),a.appendChild(u),a}}class W{container=null;session;generator;timerComponent;streakBarComponent;currentChallenge=null;isResolvingAnswer=!1;isCountingDown=!0;isPaused=!1;feedbackTimeout=null;countdownInterval=null;keydownHandler=null;onGameOver;onQuitToHome;constructor(t){this.onGameOver=t.onGameOver,this.onQuitToHome=t.onQuitToHome;const e=p.getSettings();this.session=new F(e.difficulty),this.generator=new H(e.hardMode),this.timerComponent=new G(l.SESSION_DURATION_SEC),this.streakBarComponent=new U}mount(t){this.container=t;const e=p.getBestScore(),s=p.getBestStreak(),n=this.session.getMetrics().difficulty;this.container.innerHTML=`
      <div class="screen-gameplay">
        <!-- Countdown Overlay -->
        <div id="gameplay-countdown" class="countdown-overlay">
          <div id="countdown-text" class="countdown-number">3</div>
        </div>

        <!-- Top HUD Bar -->
        <header class="gameplay-hud-top">
          <div class="hud-left-group">
            <button id="btn-gameplay-pause" class="btn-pause" aria-label="Pause Game" title="Pause">
              <span>❚❚</span>
            </button>
            <div id="timer-container-mount"></div>
          </div>

          <div class="brand-logo-compact">
            <div class="brand-color-row">
              <span class="letter-c">C</span>
              <span class="letter-o1">O</span>
              <span class="letter-l">L</span>
              <span class="letter-o2">O</span>
              <span class="letter-r">R</span>
            </div>
            <div class="brand-trap-row">
              <span>T</span>
              <span>R</span>
              <span class="trap-letter-a">
                A
                <svg class="trap-warning-icon" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,3 22,21 2,21" fill="#FFC400" stroke="#000000" stroke-width="2"/>
                  <circle cx="12" cy="17" r="1.5" fill="#000000"/>
                  <line x1="12" y1="8" x2="12" y2="13" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </span>
              <span>P</span>
            </div>
            <div class="hud-difficulty-badge" id="hud-difficulty-badge">MODE: ${n}</div>
          </div>

          <div class="hud-right-group">
            <div class="hud-stat-pill">
              <span class="hud-stat-title">SCORE</span>
              <span id="hud-score-val" class="hud-stat-val-score">0</span>
              <span class="hud-stat-sub">BEST <span id="hud-best-score-val">${e}</span></span>
            </div>

            <div class="hud-stat-pill">
              <span class="hud-stat-title">STREAK</span>
              <span id="hud-streak-val" class="hud-stat-val-streak">x0</span>
              <span class="hud-stat-sub">BEST: x<span id="hud-best-streak-val">${s}</span></span>
            </div>
          </div>
        </header>

        <!-- Rainbow Intensity Progress Bar -->
        <div id="streakbar-container-mount" style="width: 100%; max-width: 820px;"></div>

        <!-- Central Challenge Card -->
        <main class="gameplay-challenge-card" id="challenge-card-el">
          <div id="challenge-stimulus-mount" class="challenge-stimulus-box"></div>
          <div id="challenge-question" class="challenge-question-text"></div>
        </main>

        <!-- 2x2 Answer Grid -->
        <div id="gameplay-answers-grid" class="gameplay-answers-grid"></div>

        <!-- Bottom Performance HUD Footer -->
        <footer class="gameplay-footer-hud">
          <div class="perf-item">
            <span class="perf-icon">⚡</span>
            <div>
              <span class="perf-label">ACCURACY</span>
              <div id="footer-accuracy" class="perf-val val-accuracy">100%</div>
            </div>
          </div>

          <div class="perf-divider"></div>

          <div class="perf-item">
            <span class="perf-icon">⏱️</span>
            <div>
              <span class="perf-label">AVG. REACTION</span>
              <div id="footer-avg-reaction" class="perf-val val-avg-reaction">0 ms</div>
            </div>
          </div>

          <div class="perf-divider"></div>

          <div class="perf-item">
            <span class="perf-icon">🏆</span>
            <div>
              <span class="perf-label">BEST REACTION</span>
              <div id="footer-best-reaction" class="perf-val val-best-reaction">0 ms</div>
            </div>
          </div>
        </footer>
      </div>
    `,document.getElementById("timer-container-mount")?.appendChild(this.timerComponent.getElement()),document.getElementById("streakbar-container-mount")?.appendChild(this.streakBarComponent.getElement()),document.getElementById("btn-gameplay-pause")?.addEventListener("click",()=>{this.togglePause()}),this.keydownHandler=i=>{if(!this.isCountingDown){if(i.code==="Escape"||i.key.toLowerCase()==="p"){i.preventDefault(),this.togglePause();return}if(!(this.isPaused||this.isResolvingAnswer)&&["1","2","3","4"].includes(i.key)){i.preventDefault();const a=parseInt(i.key,10)-1;this.selectOptionByIndex(a)}}},window.addEventListener("keydown",this.keydownHandler),this.startCountdown()}startCountdown(){this.countdownInterval!==null&&(clearInterval(this.countdownInterval),this.countdownInterval=null),this.isCountingDown=!0;let t=3;const e=document.getElementById("countdown-text");d.playCountdownBeep(!1),this.countdownInterval=window.setInterval(()=>{if(t-=1,t>0)e&&(e.textContent=t.toString(),e.classList.remove("countdown-go")),d.playCountdownBeep(!1);else if(t===0)e&&(e.textContent="GO!",e.classList.add("countdown-go")),d.playCountdownBeep(!0);else{this.countdownInterval!==null&&(clearInterval(this.countdownInterval),this.countdownInterval=null);const s=document.getElementById("gameplay-countdown");s&&(s.style.display="none"),this.isCountingDown=!1,this.beginActiveSession()}},850)}beginActiveSession(){x.gameplayStart(),this.session.start((t,e)=>{this.updateHUD(t,e)},t=>{x.gameplayStop(),d.playGameOver(),this.onGameOver(t)}),this.nextChallenge(),p.hasSeenTutorial()||this.showTutorialGuide()}showTutorialGuide(){if(document.getElementById("tutorial-pointer"))return;const t=document.getElementById("challenge-card-el");if(!t)return;const e=document.createElement("div");e.id="tutorial-pointer",e.className="tutorial-guide-overlay",e.innerHTML=`
      <div class="tutorial-hand-bounce">👆</div>
      <div class="tutorial-tip-pill">DON'T READ IT. TAP THE COLOR!</div>
    `,t.appendChild(e)}hideTutorialGuide(){const t=document.getElementById("tutorial-pointer");t&&t.remove()}nextChallenge(){if(this.isPaused)return;this.isResolvingAnswer=!1;const t=this.session.getElapsedSeconds();this.currentChallenge=this.generator.generateNext(t);const e=document.getElementById("challenge-stimulus-mount");e&&this.currentChallenge&&Y.render(this.currentChallenge.stimulus,e);const s=document.getElementById("challenge-question");s&&this.currentChallenge&&(s.textContent=this.currentChallenge.question);const n=document.getElementById("gameplay-answers-grid");n&&this.currentChallenge&&(n.innerHTML="",this.currentChallenge.options.forEach((i,a)=>{const o=document.createElement("button"),r=i.colorId?`btn-answer-${i.colorId}`:"btn-answer-blue";o.className=`btn-arcade btn-answer ${r}`,o.id=`btn-answer-opt-${a}`,o.setAttribute("data-option-id",i.id),o.setAttribute("aria-label",`Option ${a+1}: ${i.label}`);const c=i.colorId?`dot-${i.colorId}`:"dot-blue";o.innerHTML=`
          <div class="answer-dot ${c}"></div>
          <span class="answer-label">${i.label}</span>
          <span style="font-size: 0.8rem; opacity: 0.6; font-weight: 700;">[${a+1}]</span>
        `,o.addEventListener("click",()=>{this.handleAnswer(i.id,o)}),n.appendChild(o)}))}selectOptionByIndex(t){if(!this.currentChallenge)return;const e=this.currentChallenge.options[t];if(e){const s=document.getElementById(`btn-answer-opt-${t}`);s&&this.handleAnswer(e.id,s)}}handleAnswer(t,e){if(this.isResolvingAnswer||!this.currentChallenge||this.isPaused)return;this.isResolvingAnswer=!0;const s=performance.now(),n=Math.max(1,Math.round(s-this.currentChallenge.startTime)),i=t===this.currentChallenge.correctAnswerId;p.hasSeenTutorial()||(p.setTutorialSeen(!0),this.hideTutorialGuide());const a=this.session.recordAnswer(i,n);i?(d.playCorrect(this.session.getMetrics().currentStreak),e.classList.add("flash-correct"),this.showScoreFloater(`+${a.pointsAwarded}${a.speedBonus>0?" SPEED!":""}`)):(d.playWrong(),e.classList.add("flash-wrong"));const o=this.session.getMetrics();this.updateHUD(o,this.session.getRemainingSeconds());const r=o.difficulty,c=l.FEEDBACK_DURATIONS[r]||(o.hardMode?200:300);this.feedbackTimeout=window.setTimeout(()=>{e.classList.remove("flash-correct","flash-wrong"),this.nextChallenge()},c)}showScoreFloater(t){const e=document.getElementById("challenge-card-el");if(!e)return;const s=document.createElement("div");s.className="score-floater",s.textContent=t,e.appendChild(s),setTimeout(()=>{s.remove()},600)}updateHUD(t,e){this.timerComponent.update(e),this.streakBarComponent.update(t.currentStreak);const s=document.getElementById("hud-score-val");s&&(s.textContent=t.score.toString());const n=document.getElementById("hud-streak-val");n&&(n.textContent=`x${t.currentStreak}`);const i=document.getElementById("footer-accuracy");i&&(i.textContent=`${t.accuracyPercent}%`);const a=document.getElementById("footer-avg-reaction");a&&(a.textContent=`${t.averageReactionTimeMs} ms`);const o=document.getElementById("footer-best-reaction");o&&(o.textContent=`${t.bestReactionTimeMs} ms`)}restartSession(){this.countdownInterval!==null&&(clearInterval(this.countdownInterval),this.countdownInterval=null),this.feedbackTimeout!==null&&(clearTimeout(this.feedbackTimeout),this.feedbackTimeout=null);const t=p.getSettings();this.session.reset(t.difficulty);const e=document.getElementById("hud-difficulty-badge");e&&(e.textContent=`MODE: ${t.difficulty}`),this.hideTutorialGuide(),this.isPaused=!1,this.isResolvingAnswer=!1,this.isCountingDown=!0,this.currentChallenge=null,this.timerComponent.update(l.SESSION_DURATION_SEC),this.streakBarComponent.update(0);const s=document.getElementById("hud-score-val");s&&(s.textContent="0");const n=document.getElementById("hud-streak-val");n&&(n.textContent="x0");const i=document.getElementById("footer-accuracy");i&&(i.textContent="100%");const a=document.getElementById("footer-avg-reaction");a&&(a.textContent="0 ms");const o=document.getElementById("footer-best-reaction");o&&(o.textContent="0 ms");const r=document.getElementById("challenge-stimulus-mount");r&&(r.innerHTML="");const c=document.getElementById("challenge-question");c&&(c.textContent="");const u=document.getElementById("gameplay-answers-grid");u&&(u.innerHTML=""),document.querySelectorAll(".feedback-float").forEach(b=>b.remove());const S=document.getElementById("gameplay-countdown"),w=document.getElementById("countdown-text");w&&(w.textContent="3",w.classList.remove("countdown-go")),S&&(S.style.display="flex"),this.startCountdown()}togglePause(){this.isCountingDown||this.isPaused||(this.isPaused=!0,this.session.pause(),d.playClick(),E.showPauseModal(()=>{this.isPaused=!1,this.session.resume()},()=>{this.restartSession()},()=>{this.session.stop(),x.gameplayStop(),this.onQuitToHome()}))}unmount(){this.countdownInterval!==null&&(clearInterval(this.countdownInterval),this.countdownInterval=null),this.feedbackTimeout!==null&&(clearTimeout(this.feedbackTimeout),this.feedbackTimeout=null),this.keydownHandler&&(window.removeEventListener("keydown",this.keydownHandler),this.keydownHandler=null),this.hideTutorialGuide(),this.session.stop(),this.container&&(this.container.innerHTML="",this.container=null)}}class z{canvas;ctx;particles=[];isRunning=!1;colors=["#FF2238","#0088FF","#14C834","#FFB800","#A23DF5","#FF6600","#FFFFFF"];constructor(){this.canvas=document.getElementById("confetti-canvas"),this.ctx=this.canvas?this.canvas.getContext("2d"):null,this.resize(),window.addEventListener("resize",()=>this.resize())}resize(){this.canvas&&(this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight)}fire(t=80){if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){this.resize();for(let e=0;e<t;e++)this.particles.push({x:Math.random()*this.canvas.width,y:-20,size:Math.random()*8+6,color:this.colors[Math.floor(Math.random()*this.colors.length)],speedX:(Math.random()-.5)*6,speedY:Math.random()*5+3,angle:Math.random()*360,rotationSpeed:(Math.random()-.5)*10,alpha:1});this.isRunning||(this.isRunning=!0,this.loop())}}loop(){if(!this.ctx||this.particles.length===0){this.isRunning=!1,this.ctx&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);return}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let t=this.particles.length-1;t>=0;t--){const e=this.particles[t];if(e.x+=e.speedX,e.y+=e.speedY,e.angle+=e.rotationSpeed,e.y>this.canvas.height*.75&&(e.alpha-=.02),e.alpha<=0||e.y>this.canvas.height+20){this.particles.splice(t,1);continue}this.ctx.save(),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.angle*Math.PI/180),this.ctx.globalAlpha=Math.max(0,e.alpha),this.ctx.fillStyle=e.color,this.ctx.fillRect(-e.size/2,-e.size/2,e.size,e.size*.6),this.ctx.restore()}requestAnimationFrame(()=>this.loop())}clear(){this.particles=[],this.ctx&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}}const O=new z;class K{container=null;metrics;keydownHandler=null;onPlayAgain;onHome;constructor(t,e){this.metrics=t,this.onPlayAgain=e.onPlayAgain,this.onHome=e.onHome}mount(t){this.container=t;const{isNewBestScore:e,isNewBestStreak:s}=p.recordGameCompletion({score:this.metrics.score,streak:this.metrics.maxStreak,correct:this.metrics.correctAnswers,wrong:this.metrics.wrongAnswers,totalReactionTimeMs:this.metrics.totalReactionTimeMs,bestReactionTimeMs:this.metrics.bestReactionTimeMs}),n=p.getBestScore(),i=p.getBestStreak();(e||this.metrics.score>=50)&&O.fire(90),this.container.innerHTML=`
      <div class="screen-game-over">
        <!-- Top Header -->
        <header class="gameover-header">
          <button id="btn-gameover-home" class="btn-back">
            <span>🏠</span>
            <span>HOME</span>
          </button>

          <div class="gameover-header-center brand-logo-compact">
            <div class="brand-color-row">
              <span class="letter-c">C</span>
              <span class="letter-o1">O</span>
              <span class="letter-l">L</span>
              <span class="letter-o2">O</span>
              <span class="letter-r">R</span>
            </div>
            <div class="brand-trap-row">
              <span>T</span>
              <span>R</span>
              <span class="trap-letter-a">
                A
                <svg class="trap-warning-icon" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,3 22,21 2,21" fill="#FFC400" stroke="#000000" stroke-width="2"/>
                  <circle cx="12" cy="17" r="1.5" fill="#000000"/>
                  <line x1="12" y1="8" x2="12" y2="13" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </span>
              <span>P</span>
            </div>
            <h1 class="game-over-title">GAME OVER!</h1>
            <div class="brand-tagline">
              <span class="part-white">DON'T READ IT.</span>
              <span class="part-yellow">SEE IT.</span>
            </div>
          </div>

          <button id="btn-gameover-share" class="btn-back">
            <span>🔗</span>
            <span>SHARE</span>
          </button>
        </header>

        <!-- 3 Results Cards -->
        <main class="gameover-cards-grid">
          <!-- Card 1: Score -->
          <div class="result-card">
            <div class="result-card-title">YOUR SCORE</div>
            <div class="score-big-display">
              <div class="score-big-val">${this.metrics.score}</div>
              ${e?'<div class="badge-new-best">★ NEW BEST! ★</div>':""}
            </div>
            <div class="score-alltime-best">
              <span>👑 BEST SCORE</span>
              <strong>${n}</strong>
            </div>
          </div>

          <!-- Card 2: Summary -->
          <div class="result-card">
            <div class="result-card-title">SUMMARY</div>
            <div class="summary-items-list">
              <div class="summary-row">
                <span class="summary-row-label"><span>🎯</span> CORRECT ANSWERS</span>
                <span class="summary-row-val val-green">${this.metrics.correctAnswers}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>❌</span> WRONG ANSWERS</span>
                <span class="summary-row-val val-red">${this.metrics.wrongAnswers}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>🔄</span> ACCURACY</span>
                <span class="summary-row-val val-cyan">${this.metrics.accuracyPercent}%</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>⚡</span> MAX STREAK</span>
                <span class="summary-row-val val-purple">x${this.metrics.maxStreak}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>⏱️</span> AVG. REACTION TIME</span>
                <span class="summary-row-val val-orange">${this.metrics.averageReactionTimeMs} ms</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Best Streak with Sunglasses Flame Mascot -->
          <div class="result-card">
            <div class="result-card-title">BEST STREAK</div>
            <div class="streak-big-val">x${this.metrics.maxStreak}</div>
            ${s?'<div class="badge-new-best" style="margin-top: 4px;">NEW BEST!</div>':`<div style="font-size: 0.78rem; color: #B5C4E8; margin-top: 4px;">BEST: x${i}</div>`}
            
            <div class="flame-mascot-wrap">
              <!-- Animated Fire Flame Mascot with Cool Sunglasses -->
              <svg class="flame-mascot-svg" viewBox="0 0 100 100">
                <!-- Outer Flame -->
                <path d="M50,8 C55,22 75,32 78,50 C82,68 70,88 50,92 C30,88 18,68 22,50 C25,32 45,22 50,8 Z"
                  fill="url(#flameGradOuter)" filter="drop-shadow(0 0 8px #FF6600)" />
                <!-- Inner Flame -->
                <path d="M50,30 C53,40 66,48 68,60 C70,72 62,82 50,85 C38,82 30,72 32,60 C34,48 47,40 50,30 Z"
                  fill="url(#flameGradInner)" />
                <!-- Cute Sunglasses -->
                <rect x="26" y="52" width="20" height="13" rx="4" fill="#111111" stroke="#333333" stroke-width="1.5"/>
                <rect x="54" y="52" width="20" height="13" rx="4" fill="#111111" stroke="#333333" stroke-width="1.5"/>
                <line x1="46" y1="56" x2="54" y2="56" stroke="#111111" stroke-width="3"/>
                <!-- Sunglasses Glare -->
                <polygon points="28,54 36,54 32,62 28,62" fill="rgba(255,255,255,0.4)"/>
                <polygon points="56,54 64,54 60,62 56,62" fill="rgba(255,255,255,0.4)"/>
                <!-- Smile -->
                <path d="M42,72 Q50,78 58,72" stroke="#681500" stroke-width="2.5" stroke-linecap="round" fill="none"/>

                <defs>
                  <linearGradient id="flameGradOuter" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFE033" />
                    <stop offset="45%" stop-color="#FF6600" />
                    <stop offset="100%" stop-color="#FF2238" />
                  </linearGradient>
                  <linearGradient id="flameGradInner" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" />
                    <stop offset="50%" stop-color="#FFE033" />
                    <stop offset="100%" stop-color="#FF8533" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </main>

        <!-- Actions Row -->
        <div class="gameover-actions-row">
          <button id="btn-replay-normal" class="btn-arcade btn-purple">
            🔄 PLAY AGAIN
          </button>
          <button id="btn-gameover-stats" class="btn-arcade btn-blue">
            📊 STATS
          </button>
          <button id="btn-replay-hard" class="btn-arcade btn-green">
            ▶ PLAY AGAIN (HARDER!)
          </button>
        </div>

        <!-- Bottom Tip Banner -->
        <footer class="gameover-bottom-banner">
          <div class="banner-left">
            <span style="font-size: 1.2rem;">💡</span>
            <span><strong>TIP:</strong> Trust your eyes, not your brain.</span>
          </div>
          <div class="banner-right">
            “ FOCUS. REACT. WIN. ”
          </div>
        </footer>
      </div>
    `,document.getElementById("btn-gameover-home")?.addEventListener("click",()=>{d.playClick(),this.onHome()}),document.getElementById("btn-replay-normal")?.addEventListener("click",()=>{d.playClick(),this.onPlayAgain(!1)}),document.getElementById("btn-replay-hard")?.addEventListener("click",()=>{d.playClick(),this.onPlayAgain(!0)}),document.getElementById("btn-gameover-stats")?.addEventListener("click",()=>{d.playClick(),E.showStatsModal()}),document.getElementById("btn-gameover-share")?.addEventListener("click",()=>{d.playClick(),navigator.share?navigator.share({title:"Color Trap!",text:`I scored ${this.metrics.score} points with a ${this.metrics.maxStreak}x streak in Color Trap! Can you beat me?`,url:window.location.href}).catch(()=>{}):(navigator.clipboard.writeText(`I scored ${this.metrics.score} points in Color Trap with a ${this.metrics.maxStreak}x streak! Don't read it. See it.`),alert("Score copied to clipboard! Share it with friends!"))}),this.keydownHandler=a=>{a.code==="Space"||a.code==="Enter"?(a.preventDefault(),d.playClick(),this.onPlayAgain(!1)):a.code==="Escape"&&(a.preventDefault(),d.playClick(),this.onHome())},window.addEventListener("keydown",this.keydownHandler)}unmount(){this.keydownHandler&&(window.removeEventListener("keydown",this.keydownHandler),this.keydownHandler=null),O.clear(),this.container&&(this.container.innerHTML="",this.container=null)}}class V{currentState="HOME";listeners=new Set;allowedTransitions={HOME:["INSTRUCTIONS","COUNTDOWN"],INSTRUCTIONS:["HOME","COUNTDOWN"],COUNTDOWN:["PLAYING","HOME"],PLAYING:["PAUSED","GAMEOVER","HOME"],PAUSED:["PLAYING","COUNTDOWN","HOME"],GAMEOVER:["COUNTDOWN","HOME"]};getState(){return this.currentState}canTransitionTo(t){return this.allowedTransitions[this.currentState]?.includes(t)??!1}transitionTo(t){if(this.currentState===t)return!1;if(!this.canTransitionTo(t))return console.warn(`StateMachine: invalid transition from ${this.currentState} to ${t}`),!1;const s=this.currentState;return this.currentState=t,this.notifyListeners(t,s),!0}subscribe(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}notifyListeners(t,e){this.listeners.forEach(s=>{try{s(t,e)}catch(n){console.error("StateMachine listener error:",n)}})}}const A=new V;class q{appRoot;currentScreenInstance=null;constructor(t){this.appRoot=t}showHome(){A.transitionTo("HOME"),this.switchScreen(new B({onPlay:()=>this.showGameplay(),onHowToPlay:()=>this.showInstructions()}))}showInstructions(){A.transitionTo("INSTRUCTIONS"),this.switchScreen(new N({onBack:()=>this.showHome(),onGotIt:()=>this.showGameplay()}))}showGameplay(t=!1){t&&p.saveSettings({hardMode:!0}),A.transitionTo("COUNTDOWN"),this.switchScreen(new W({onGameOver:e=>this.showGameOver(e),onQuitToHome:()=>this.showHome()}))}showGameOver(t){A.transitionTo("GAMEOVER"),this.switchScreen(new K(t,{onPlayAgain:e=>this.showGameplay(e),onHome:()=>this.showHome()}))}switchScreen(t){this.currentScreenInstance&&(this.currentScreenInstance.unmount(),this.currentScreenInstance=null),this.appRoot.innerHTML="",this.currentScreenInstance=t,t.mount(this.appRoot)}}document.addEventListener("DOMContentLoaded",()=>{const h=document.getElementById("app");if(!h){console.error("Color Trap: #app element not found!");return}const t=new q(h);t.showHome(),window.__colorTrapScreenManager=t});
