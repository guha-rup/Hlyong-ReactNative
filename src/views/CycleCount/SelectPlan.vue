--- START OF FILE Paste May 27, 2026 - 3:46PM ---

<template>
  <master class="cc-root">
    <div class="cc-wrap">

      <transition name="slide" mode="out-in">

        <!-- ══ STEP 0 — PLAN SELECTION ══ -->
        <div v-if="currentStep === 0" class="screen" key="s0">
          <div class="topbar">
            <div class="topbar-brand">
              <div class="brand-dot"></div>
              <span>Cycle Count</span>
            </div>
            <button class="icon-btn" @click="fetchAllPlans" aria-label="Refresh">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            </button>
          </div>

          <div class="screen-body">
            <div class="page-hero">
              <p class="eyebrow">Assigned to you</p>
              <h1 class="display-title">Plans</h1>
            </div>

            <div v-if="isLoading" class="loader-wrap"><ion-spinner name="crescent"></ion-spinner></div>

            <template v-else>
              <!-- PENDING PLANS -->
              <div class="section-header" style="margin-bottom:10px;">
                <span class="section-title">Pending</span>
                <span class="section-badge badge-pending">{{ pendingPlans.length }}</span>
              </div>
              <div v-if="pendingPlans.length === 0" class="empty-card" style="margin-bottom:20px;">
                <p class="empty-title" style="font-size:14px;">No pending plans</p>
              </div>
              <div v-else class="plan-list" style="margin-bottom:24px;">
                <div v-for="plan in pendingPlans" :key="plan.PLAN_SYS_ID" class="plan-card plan-card--pending" @click="selectPlan(plan)">
                  <div class="plan-card-inner">
                    <div class="plan-body">
                      <div class="plan-name">{{ plan.PLAN_NAME }}</div>
                      <div class="plan-meta">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{{ formatDate(plan.START_DATE) }} – {{ formatDate(plan.END_DATE) }}</span>
                      </div>
                      <div v-if="plan.ASSIGN_TO" class="plan-assign">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        {{ plan.ASSIGN_TO }}
                      </div>
                    </div>
                    <div class="plan-right">
                      <span class="pill" :class="getPlanPill(plan.PLAN_STATUS)">{{ plan.PLAN_STATUS }}</span>
                      <svg class="arrow-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- COMPLETED PLANS -->
              <div class="section-header" style="margin-bottom:10px;">
                <span class="section-title">Completed</span>
                <span class="section-badge badge-done">{{ completedPlans.length }}</span>
              </div>
              <div v-if="completedPlans.length === 0" class="empty-card">
                <p class="empty-title" style="font-size:14px;">No completed plans</p>
              </div>
              <div v-else class="plan-list">
                <div v-for="plan in completedPlans" :key="plan.PLAN_SYS_ID" class="plan-card plan-card--completed" @click="selectPlan(plan)">
                  <div class="plan-card-inner">
                    <div class="plan-body">
                      <div class="plan-name">{{ plan.PLAN_NAME }}</div>
                      <div class="plan-meta">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{{ formatDate(plan.START_DATE) }} – {{ formatDate(plan.END_DATE) }}</span>
                        
                      </div>
                      <div v-if="plan.ASSIGN_TO" class="plan-assign">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        {{ plan.ASSIGN_TO }}
                      </div>  
                    </div>
                    
                    <div class="plan-right">
                      <span class="pill pill-green">Completed</span>
                      <svg class="arrow-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      <span v-if="plan.COMPLETED_DATE_AND_TIME" style="font-size: 11px; color: var(--ink3); white-space: nowrap; margin-top: 2px;">
                        {{ plan.COMPLETED_DATE_AND_TIME }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="screen-foot">
            <p class="foot-hint">Tap a plan to begin</p>
          </div>
        </div>

        <!-- ══ STEP 0.5 — DIRECT COUNTING INTERFACE ══ -->
        <div v-else-if="currentStep === 'gate'" class="screen" key="sgate">
          <div class="topbar">
            <button class="back-btn" @click="goToStep(0)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="topbar-title">{{ planName }}</span>
          </div>
          <div class="screen-body gate-body">

            <!-- BINS SECTION (DIRECT ACCESS) -->
            <div class="counting-interface">
              <!-- Progress ring + stats -->
              <div class="progress-panel">
                <div class="progress-ring-wrap">
                  <svg class="progress-ring" width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f0f0" stroke-width="7"/>
                   <circle cx="40" cy="40" r="32" fill="none" 
  :stroke="completedBinsCount === 0 && skippedBinsCount > 0 ? '#a855f7' : '#22c55e'" 
  stroke-width="7"
  stroke-dasharray="201"
  :stroke-dashoffset="201 - (progressPercentage / 100) * 201"
  stroke-linecap="round"
  transform="rotate(-90 40 40)"
  style="transition: stroke-dashoffset 0.5s ease"/>
                  </svg>
                  <div class="ring-label">{{ Math.round(progressPercentage) }}<span style="font-size:10px">%</span></div>
                </div>
                <div class="progress-stats">
                  <div class="stat-pill">
                    <span class="stat-dot green-dot"></span>
                    <span class="stat-count">{{ completedBinsCount }}</span>
                    <span class="stat-lbl">Done</span>
                  </div>
                  <div class="stat-pill">
                    <span class="stat-dot purple-dot"></span>
                    <span class="stat-count">{{ skippedBinsCount }}</span>
                    <span class="stat-lbl">Skipped</span>
                  </div>
                </div>
              </div>

              <!-- Start Button (Shows if not started) -->
              <!-- <div v-if="!hasStartedCounting && !planSubmitted" style="margin-bottom: 24px;">
                <button class="primary-btn full-btn" @click="startCountingAction">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  {{ progressPercentage > 0 ? 'Start Counting' : 'Start Counting' }}
                </button>
              </div> -->

              <!-- Scanner and Bins (Visible but disabled until started) -->
              <div>
                <!-- Scanner -->
                <div class="scanner-block" @click="activateMachineSensorBin">
                  <div class="scanner-frame" :class="{ active: isLaserReadyBin }">
                    <div class="corner tl"></div><div class="corner tr"></div>
                    <div class="corner bl"></div><div class="corner br"></div>
                    <div class="laser-line" v-if="isLaserReadyBin"></div>
                    <div class="scanner-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" :class="{ 'scan-pulse': isLaserReadyBin }"><path d="M384 400.33l35.13-.33A29 29 0 00448 371.13V140.87A29 29 0 00419.13 112l-35.13.33M128 112l-35.13.33A29 29 0 0064 141.13v230.2A29 29 0 0092.87 400l35.13-.33M384 192v128M320 160v192M256 176v160M192 160v192M128 192v128"/></svg>
                      <span class="scanner-label">{{ isLaserReadyBin ? 'READY — PRESS BUTTON' : 'TAP TO SCAN BIN' }}</span>
                    </div>
                  </div>
                  <button v-if="isLaserReadyBin" class="alt-scan-btn" @click.stop="isLaserReadyBin = false; startCameraScan('bin')">
                    Use camera instead
                  </button>
                </div>
                <input ref="machineInputCatcherBin" type="text" class="ghost-input"
                  @keyup.enter="handleMachineScanBin" @blur="refocusIfActiveBin" />

                <div class="section-header">
                  <span class="section-title">Select a bin to count</span>
                </div>
                <div class="bin-list">
                  <div v-for="bin in displayBins" :key="bin.name" class="bin-card" :class="'bin-card--' + bin.status" @click="openBin(bin.name)">
                    <div class="bin-info">
                      <div class="bin-name">{{ bin.name }}</div>
                      <div class="bin-sub">{{ bin.totalItems }} item{{ bin.totalItems !== 1 ? 's' : '' }} · {{ getBinSubtext(bin) }}</div>
                    </div>
                    <span class="pill" :class="getBinPill(bin.status)">{{ bin.status }}</span>
                    <svg class="arrow-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                  <button class="more-btn" v-if="!showAllBins && bins.length > 4" @click="showAllBins = true">
                    +{{ bins.length - 4 }} more
                  </button>
                  <button class="more-btn" v-if="showAllBins && bins.length > 4" @click="showAllBins = false">
                    Show less
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="screen-foot" style="background:transparent; border-top:none; padding-bottom:40px;">
            <div class="gate-footer-actions">
              <button class="primary-btn half-btn" @click="goToStep(4)" v-if="(completedBinsCount + skippedBinsCount) === bins.length">View Summary</button>
              <button class="primary-btn half-btn" @click="goToStep(5)" v-if="!planSubmitted && (completedBinsCount + skippedBinsCount) === bins.length">Submit</button>
            </div>
          </div>
        </div>
        
        <!-- ══ STEP 2 — BIN DETAIL ══ -->
        <div v-else-if="currentStep === 2" class="screen" key="s2">
          <div class="topbar">
            <button class="back-btn" @click="goBackFromBinDetail">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="pill" :class="getBinPill(selectedBinData?.status)">{{ selectedBinData?.status }}</span>
          </div>
           

          <div class="screen-body">
            <div class="page-hero" style="padding-bottom: 16px;">
 
              <div  v-if="!planSubmitted"  class="scanner-block" @click="activateMachineSensorItem">
                <div class="scanner-frame" :class="{ active: isLaserReadyItem }">
                  <div class="corner tl"></div><div class="corner tr"></div>
                  <div class="corner bl"></div><div class="corner br"></div>
                  <div class="laser-line" v-if="isLaserReadyItem"></div>
                  <div class="scanner-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" :class="{ 'scan-pulse': isLaserReadyItem }"><path d="M384 400.33l35.13-.33A29 29 0 00448 371.13V140.87A29 29 0 00419.13 112l-35.13.33M128 112l-35.13.33A29 29 0 0064 141.13v230.2A29 29 0 0092.87 400l35.13-.33M384 192v128M320 160v192M256 176v160M192 160v192M128 192v128"/></svg>
                    <span class="scanner-label">{{ isLaserReadyItem ? 'READY — PRESS BUTTON' : 'TAP TO SCAN ITEM' }}</span>
                  </div>
                </div>
                <button v-if="isLaserReadyItem" class="alt-scan-btn" @click.stop="isLaserReadyItem = false; startCameraScan('item')">
                  Use camera instead
                </button>
              </div>
              <input ref="machineInputCatcherItem" type="text" class="ghost-input"
                @keyup.enter="handleMachineScanItem" @blur="refocusIfActiveItem" />

              <div class="bin-meta-card" style="display:flex; flex-direction:column; gap:8px; background:var(--surface2); border:1px solid var(--border); border-radius:var(--r-md); padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:12px; color:var(--ink3); font-weight:600; text-transform:uppercase; letter-spacing:0.04em;">Warehouse Name</span>
                  <span style="font-size:13px; font-weight:700; color:var(--ink);">CSS WAREHOUSE</span>
                </div>
                
                <div style="height:1px; background:var(--border);"></div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:12px; color:var(--ink3); font-weight:600; text-transform:uppercase; letter-spacing:0.04em;">Bin No.</span>
                  <span style="font-size:15px; font-weight:800; color:var(--blue);">{{ selectedBinName }}</span>
                </div>
              </div>
            </div>

            <!-- Dynamic section header based on whether items exist with products -->
            <div class="section-header">
              <span class="section-title">
                {{ itemsInSelectedBin.some(t => t.PRODUCT_NAME) ? 'Items in this bin' : 'No product found' }}
              </span>
            </div>

            <div class="item-list">
              <div v-for="task in itemsInSelectedBin" :key="task.GENERATE_CC_SYS_ID"
                   class="item-card" :class="{ 'item-done': task.isCompleted }">
                <div class="item-accent" :class="task.isCompleted ? 'accent-green' : 'accent-amber'"></div>
                <div class="item-card-body">
                  <div class="item-top-row">
                    <div style="flex:1; min-width:0;">
                      <div class="item-name" :class="{ 'item-empty': !task.PRODUCT_NAME }">
                        {{ task.PRODUCT_NAME || 'No product assigned' }}
                      </div>
                      <div class="item-meta">
                        <span v-if="task.PART_NO" class="item-code-wrap">
                          <span class="item-code-label">Part No:</span>
                          <span class="item-code">{{ task.PART_NO }}</span>
                        </span>
                        <span v-if="task.ITEM_CATEGORY" class="sep" v-show="task.PART_NO">·</span>
                      </div>
                    </div>
                  </div>

                  <!-- Inline qty — tasks WITH product and NOT done: manual entry only -->
                  <div v-if="task.PRODUCT_NAME && !task.isCompleted" class="stacked-qty-row">
                    <!-- Primary Qty + Static UOM -->
                      <div class="qty-col">
                    <div class="qty-group">
                      <input
                        type="number"
                        class="qty-input qty-input-manual premium-input"
                        v-model.number="task._draftQty"
                        inputmode="numeric"
                        placeholder="Qty"
                        @click.stop
                      />
                      <span class="qty-uom">{{ task.UOM }}</span>
                    </div>
                    </div>

                    <!-- Secondary Qty + Dropdown UOM dynamically populated -->
                     <div class="qty-col">
                            <span class="qty-lbl" style="color: var(--red); padding-top: 10px; padding-left: 5px;">Loose Item</span>
                    <div class="qty-group">
                      <input
                        type="number"
                        class="qty-input qty-input-manual premium-input"
                        v-model.number="task._draftQty2"
                        inputmode="numeric"
                        placeholder="Qty"
                        @click.stop
                      />
                      <select class="uom-select premium-input" v-model="task._draftUom2" @click.stop>
                        <option :value="task.LOWEST_UOM">{{ task.LOWEST_UOM }}</option>
                        <option v-if="task.UOM && task.UOM !== task.LOWEST_UOM" :value="task.UOM">{{ task.UOM }}</option>
                      </select>
                    </div>
                  </div>
 </div>
                  <!-- Completed row -->
                   <div v-if="task.isCompleted" class="done-qty-row">
                    <div class="done-check-inline">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="done-qty-label">Counted:</span>
                    <span class="done-qty-val">
                      <template v-if="task.countedQty !== 0  || !task.countedQty2">
                        {{ task.countedQty }} {{ task.countedUom }}
                      </template>
                      <template v-if="task.countedQty !== 0 && task.countedQty2 > 0"></template>
                      <template v-if="task.countedQty2 !== 0">
                        {{ task.countedQty2 }} {{ task.countedUom2 }}
                      </template>
                    </span>
                  </div>
                  <!-- INLINE ITEM SEARCH PANEL (Opens directly inside the item card) -->
                  <div v-if="showInlineItemSearch && inlineSearchTask?.GENERATE_CC_SYS_ID === task.GENERATE_CC_SYS_ID" class="inline-item-search-panel" style="margin-top: 12px; margin-bottom: 0;">
                    <div class="inline-search-head">
                      <span class="inline-search-title">{{ inlineSearchContext === 'enter' ? 'Select Product' : 'Change Item' }}</span>
                      <button class="icon-btn" @click.stop="showInlineItemSearch = false; inlineSearchTask = null">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                    
                    <div v-if="inlineSearchContext === 'change' && inlineSearchTask" class="modal-current-item" style="margin:0 0 12px;">
                      <span class="modal-current-label">Current:</span>
                      <div style="display:flex; flex-direction:column;">
                        <span class="modal-current-name" style="margin-bottom:2px; font-weight:600;">{{ inlineSearchTask.PRODUCT_NAME }}</span>
                        <span v-if="inlineSearchTask.PART_NO" class="item-code-wrap">
                          <span class="item-code-label" style="color:var(--amber);">Part No:</span>
                          <span class="item-code" style="background:rgba(217,119,6,0.15); color:var(--amber);">{{ inlineSearchTask.PART_NO }}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div class="modal-search" style="margin:0 0 12px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <input type="text" v-model="itemSearchQuery" placeholder="Search by name or part no." class="modal-search-input" @keyup.enter="handleItemSearch" />
                      <button class="scan-pill-btn" @click="handleItemSearch">Go</button>
                    </div>
                    
                    <div class="inline-scan-row">
                      <button class="inline-scan-btn" @click="startCameraScan('item')">
                        <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"><path d="M384 400.33l35.13-.33A29 29 0 00448 371.13V140.87A29 29 0 00419.13 112l-35.13.33M128 112l-35.13.33A29 29 0 0064 141.13v230.2A29 29 0 0092.87 400l35.13-.33M384 192v128M320 160v192M256 176v160M192 160v192M128 192v128"/></svg>
                        Scan Barcode
                      </button>
                    </div>
                    
                    <div v-if="isFetchingProducts" class="loader-wrap" style="padding: 24px 0;">
                      <ion-spinner name="crescent"></ion-spinner>
                    </div>
                    <div v-else-if="productList.length === 0 && itemSearchQuery" class="empty-modal"><p>No products found</p></div>
                    <div v-else-if="productList.length > 0" class="modal-list" style="max-height:240px; overflow-y:auto; padding:0;">
                      <div v-for="prod in productList" :key="prod.PRODUCT_SYS_ID" class="prod-row" @click="selectNewItemInline(prod)">
                        <div class="prod-info">
                          <div class="prod-name">{{ prod.PRODUCT_NAME || prod.PRODUCT_CODE || 'Unknown Product' }}</div>
                          <div class="prod-meta">
                            <span class="item-code-wrap" v-if="prod.PART_NO">
                              <span class="item-code-label">Part No:</span>
                              <span class="item-code">{{ prod.PART_NO }}</span>
                            </span>
                          </div>
                        </div>
                        <svg class="arrow-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                    </div>
                  </div>

                  <!-- No product: Enter product button (Hides if search is open) -->
                  <div v-if="!task.PRODUCT_NAME && !task.isCompleted && !(showInlineItemSearch && inlineSearchTask?.GENERATE_CC_SYS_ID === task.GENERATE_CC_SYS_ID)" class="item-action-row">
                    <button class="enter-item-btn" @click.stop="openInlineItemSearch(task, 'enter')">
                      Enter product →
                    </button>
                  </div>

                  <!-- Has product + not done: Change Item button (Hides if search is open) -->
                  <div v-if="task.PRODUCT_NAME && !task.isCompleted && !(showInlineItemSearch && inlineSearchTask?.GENERATE_CC_SYS_ID === task.GENERATE_CC_SYS_ID)" class="item-action-row">
                    <button class="change-item-btn" @click.stop="openInlineItemSearch(task, 'change')">
                      Change Item
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div v-if="!planSubmitted" class="screen-foot bin-detail-foot" style="padding-top: 14px; flex-direction:row; gap:12px;">
            <button class="ghost-action-btn" style="flex:1; color:var(--amber);" @click="skipBin">
              Skip Bin
            </button>
            <button class="primary-btn done-next-btn" style="flex:2;" @click="doneAndNextBin">
              Done &amp; Next
            </button>
          </div>
        </div>

        <!-- ══ STEP 4 — SUMMARY ══ -->
        <div v-else-if="currentStep === 4" class="screen" key="s4">
          <div class="topbar">
            <button class="back-btn" @click="goToStep('gate')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="topbar-title">Summary</span>
          </div>

          <div class="screen-body">
            <div class="page-hero">
              <p class="eyebrow">{{ planName }}</p>
              <h1 class="display-title">Plan summary</h1>
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <p class="summary-label">Bins checked</p>
                <p class="summary-big">{{ completedBinsCount + skippedBinsCount }}<span class="summary-of">/{{ bins.length }}</span></p>
                <span class="pill" :class="(completedBinsCount + skippedBinsCount) === bins.length ? 'pill-green' : 'pill-amber'">
                  {{ (completedBinsCount + skippedBinsCount) === bins.length ? 'All done' : 'In progress' }}
                </span>
              </div>
              <div class="summary-card">
                <p class="summary-label">Items processed</p>
                <p class="summary-big">{{ totalCountedItems + totalSkippedItems }}<span class="summary-of">/{{ tasks.length }}</span></p>
                <span class="pill" :class="(totalCountedItems + totalSkippedItems) === tasks.length ? 'pill-green' : 'pill-amber'">
                  {{ tasks.length - (totalCountedItems + totalSkippedItems) > 0 ? (tasks.length - (totalCountedItems + totalSkippedItems)) + ' pending' : 'All done' }}
                </span>
              </div>
            </div>

            <div class="section-header" style="margin-bottom:14px;">
              <span class="section-title">Bin breakdown</span>
            </div>

            <div v-for="bin in bins" :key="'sum-' + bin.name" class="bin-summary-block">
              <div class="bin-summary-header">
                <div class="bin-status-bar" :class="getBinBarClass(bin.status)" style="height:20px; border-radius:2px;"></div>
                <span class="bin-summary-name">{{ bin.name }}</span>
                <div class="bin-summary-meta">
                  <span class="bin-summary-count">{{ bin.countedItems }}/{{ bin.totalItems }} items</span>
                  <span class="pill" :class="getBinPill(bin.status)">{{ bin.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ STEP 5 — FINAL SUBMIT ══ -->
        <div v-else-if="currentStep === 5" class="screen" key="s5">
          <div class="topbar">
            <button class="back-btn" @click="goToStep('gate')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="topbar-title">Submit</span>
          </div>

          <div class="screen-body">
            <div class="page-hero">
              <p class="eyebrow">Review before submitting</p>
              <h1 class="display-title">Submit</h1>
            </div>

            <div style="margin-bottom: 20px; padding: 14px 16px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-md); display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 13px; font-weight: 600; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.04em;">Plan Name</span>
              <span style="font-size: 15px; font-weight: 700; color: var(--ink); text-align: right;">{{ planName }}</span>
            </div>

            <div v-if="!allItemsHaveData" class="warning-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{{ incompleteItemsCount }} item{{ incompleteItemsCount !== 1 ? 's' : '' }} still need quantities. Fill all items before submitting.</span>
            </div>

            <div class="submit-stats-row">
              <div class="submit-stat">
                <span class="submit-stat-num">{{ bins.length }}</span>
                <span class="submit-stat-lbl">Bins</span>
              </div>
              <div class="submit-stat-divider"></div>
              <div class="submit-stat">
                <span class="submit-stat-num">{{ tasks.length }}</span>
                <span class="submit-stat-lbl">Items</span>
              </div>
              <div class="submit-stat-divider"></div>
              <div class="submit-stat">
                <span class="submit-stat-num" :class="allItemsHaveData ? 'num-green' : 'num-amber'">{{ totalCountedItems }}</span>
                <span class="submit-stat-lbl">Counted</span>
              </div>
            </div>
 <div class="fs-list">
            <div v-for="bin in bins" :key="'fs-' + bin.name" class="fs-bin-block">
              <div class="fs-bin-header">
                <div class="fs-bin-dot" :class="getBinBarClass(bin.status)"></div>
                <span class="fs-bin-name">{{ bin.name }}</span>
                <span class="pill" :class="getBinPill(bin.status)">{{ bin.status }}</span>
              </div>
             
              <div v-for="task in getTasksForBin(bin.name)" :key="'fs-t-' + task.GENERATE_CC_SYS_ID" class="fs-item-row">
                <div class="fs-item-left">
                  <div class="fs-item-name" :class="{ 'fs-item-empty': !task.PRODUCT_NAME }">
                    {{ task.PRODUCT_NAME || 'No product assigned' }}
                  </div>
                  <div class="item-meta" style="margin-top:2px;">
                    <span v-if="task.PART_NO" class="item-code-wrap">
                      <span class="item-code-label">Part No:</span>
                      <span class="item-code">{{ task.PART_NO }}</span>
                    </span>
                  </div>
                </div>
                <div class="fs-item-right">
                  <span v-if="task.isCompleted" class="fs-qty">
                    <template v-if="task.countedQty !== 0  || !task.countedQty2">
                      {{ task.countedQty }} <span class="fs-uom">{{ task.countedUom}}</span>
                    </template>
                    <!-- <template v-if="task.countedQty > 0 && task.countedQty2 > 0">
                      <span style="color: var(--ink3); font-weight: 500; margin: 0 2px;">,</span> 
                    </template> -->
                    <template v-if="task.countedQty2 !== 0 ">
                      {{ task.countedQty2 }} <span class="fs-uom">{{ task.countedUom2 }}</span>
                    </template>
                  </span>
                  <span v-else-if="task._isSkipped" class="fs-missing" style="color:#7e22ce; background:#f3e8ff; padding:2px 8px; border-radius:4px; gap:0;">
                    Skipped
                  </span>
                  <span v-else class="fs-missing">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Missing
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>

          <div class="screen-foot">
            <p v-if="!allItemsHaveData" class="foot-hint warn-hint">Complete all items to enable submit</p>
            <button class="primary-btn full-btn submit-btn"
              :class="{ 'btn-disabled': !allItemsHaveData || isSubmitting || planSubmitted }"
              @click="finalSubmit">
              <svg v-if="!isSubmitting && !planSubmitted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <svg v-if="planSubmitted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <ion-spinner v-if="isSubmitting" name="crescent" style="width:16px;height:16px;color:#fff"></ion-spinner>
              {{ isSubmitting ? 'Submitting…' : planSubmitted ? 'Submitted Successfully' : 'Submit' }}
            </button>
          </div>
        </div>

      </transition>

    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonSpinner, toastController } from '@ionic/vue';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import master from '../layouts/Master.vue';
import pick from '@/services/pick';

const LS_KEY_PREFIX = 'cyclecount_draft_';

export default defineComponent({
  name: 'CycleCount',
  components: { master, IonSpinner },
  data() {
    return {
      currentStep: 0 as number | string,
      isLoading: false,
      isSubmitting: false,
      warehouseId: '1',
      warehouseName: '',
      rackno:"",
      planNo: '1',
      planName: '',
      allPlans: [] as any[],
      selectedPlanObj: null as any,
      tasks: [] as any[],
      selectedBinName: '',
      showAllBins: false,
      isLaserReadyBin: false,
      isLaserReadyItem: false,
      planSubmitted: false,
      showInlineItemSearch: false,
      inlineSearchTask: null as any,
      inlineSearchContext: 'enter' as 'enter' | 'change',
      itemSearchQuery: '',
      productList: [] as any[],
      isFetchingProducts: false, 
      hasStartedCounting: false, 
    };
  },
  computed: {
    lsKey(): string { return LS_KEY_PREFIX + this.planNo; },
    pendingPlans(): any[] {
      return this.allPlans.filter(p => p.PLAN_STATUS !== 'Completed');
    },
    completedPlans(): any[] {
      return this.allPlans.filter(p => p.PLAN_STATUS === 'Completed');
    },
    bins(): any[] {
      const map: Record<string, any> = {};
      this.tasks.forEach(t => {
        if (!map[t.BIN_NAME]) {
          map[t.BIN_NAME] = { name: t.BIN_NAME, items: [], totalItems: 0, countedItems: 0, skippedItems: 0, BIN_SYS_ID: t.BIN_SYS_ID };
        }
        map[t.BIN_NAME].items.push(t);
        map[t.BIN_NAME].totalItems++;

        if (t.isCompleted){
          map[t.BIN_NAME].countedItems++;
        }else if (t._isSkipped){
         map[t.BIN_NAME].skippedItems++;
        }
      });
      return Object.values(map).map(group => {
        let status = 'Pending';
        if (group.skippedItems > 0 && group.skippedItems === group.totalItems) status = 'Skipped';
        else if (group.countedItems === group.totalItems && group.totalItems > 0) status = 'Done';
        else if (group.countedItems + group.skippedItems === group.totalItems && group.totalItems > 0) status = 'Done';
        else if (group.countedItems > 0 || group.skippedItems > 0) status = 'Partial';
        return { ...group, status };
      });
    },
    displayBins(): any[] { return this.showAllBins ? this.bins : this.bins.slice(0, 4); },
    completedBinsCount(): number { return this.bins.filter(b => b.status === 'Done').length; },
    partialBinsCount(): number   { return this.bins.filter(b => b.status === 'Partial').length; },
    pendingBinsCount(): number   { return this.bins.filter(b => b.status === 'Pending').length; },
    skippedBinsCount(): number   { return this.bins.filter(b => b.status === 'Skipped').length; },
    progressPercentage(): number {
      if (!this.bins.length) return 0;
      return ((this.completedBinsCount + this.skippedBinsCount) / this.bins.length) * 100;
    },
    totalCountedItems(): number { return this.tasks.filter(t => t.isCompleted).length; },
    totalSkippedItems(): number { return this.tasks.filter(t => t._isSkipped).length; },
    selectedBinData(): any { return this.bins.find(b => b.name === this.selectedBinName) || {}; },
    itemsInSelectedBin(): any[] { return this.tasks.filter(t => t.BIN_NAME === this.selectedBinName); },
    remainingItemsInBin(): number { return this.itemsInSelectedBin.filter(t => !t.isCompleted).length; },
    allItemsHaveData(): boolean {
      return this.tasks.length > 0 && this.tasks.every(t => t.isCompleted || t._isSkipped);
    },
    incompleteItemsCount(): number {
      return this.tasks.filter(t => !t.isCompleted && !t._isSkipped).length;
    },
  },
  async mounted() {
    this.planNo = (this.$route.query.planNo as string) || '1';
    this.initContext();
    await this.fetchAllPlans();
  },
  methods: {
    formatDate(dateStr: string): string {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    },

    saveDraft() {
      try {
        const draft = this.tasks.map(t => ({
          id: t.GENERATE_CC_SYS_ID,
          isCompleted: t.isCompleted,
          countedQty: t.countedQty,
          countedQty2: t.countedQty2,
          countedUom2: t.countedUom2,
          _draftQty: t._draftQty,
          _draftQty2: t._draftQty2,
          _draftUom2: t._draftUom2,
          PRODUCT_NAME: t.PRODUCT_NAME,
          UOM: t.UOM,
          LOWEST_UOM: t.LOWEST_UOM,
          _originalHadNoProduct: t._originalHadNoProduct,
          _isChangingItem: t._isChangingItem,
          _pendingNewProduct: t._pendingNewProduct,
          _isSkipped: t._isSkipped,
        }));
        localStorage.setItem(this.lsKey, JSON.stringify(draft));
      } catch {}
    },
    restoreDraft() {
      try {
        const raw = localStorage.getItem(this.lsKey);
        if (!raw) return;
        const draft: any[] = JSON.parse(raw);
        const map: Record<string, any> = {};
        draft.forEach(d => { map[d.id] = d; });
        this.tasks.forEach(t => {
          const d = map[t.GENERATE_CC_SYS_ID];
          if (d) {
            t.isCompleted = d.isCompleted;
            t.countedQty  = d.countedQty;
            t.countedQty2 = d.countedQty2 ?? 0;
            t.countedUom2 = d.countedUom2 ?? (d.LOWEST_UOM || 'EA');
            t._draftQty   = d._draftQty ?? (d.isCompleted ? d.countedQty : null);
            t._draftQty2  = d._draftQty2 ?? (d.isCompleted && d.countedQty2 ? d.countedQty2 : null);
            t._draftUom2  = d._draftUom2 ?? (d.LOWEST_UOM || 'EA');
            t.LOWEST_UOM  = d.LOWEST_UOM || t.LOWEST_UOM;
            
            if (d.PRODUCT_NAME) t.PRODUCT_NAME = d.PRODUCT_NAME;
            if (d.UOM)          t.UOM = d.UOM;
            t._originalHadNoProduct = d._originalHadNoProduct;
            t._isChangingItem       = d._isChangingItem ?? false;
            t._pendingNewProduct    = d._pendingNewProduct ?? null;
            t._isSkipped            = d._isSkipped ?? false;
          }
        });
      } catch {}
    },
    clearDraft() {
      try { localStorage.removeItem(this.lsKey); } catch {}
    },

    activateMachineSensorBin() {
      this.isLaserReadyBin = true;
      this.$nextTick(() => {
        const input = this.$refs.machineInputCatcherBin as HTMLInputElement;
        if (input) input.focus();
      });
    },
    refocusIfActiveBin() {
      if (this.isLaserReadyBin) {
        setTimeout(() => {
          const input = this.$refs.machineInputCatcherBin as HTMLInputElement;
          if (input) input.focus();
        }, 150);
      }
    },
    handleMachineScanBin(event: any) {
      const val = event.target.value;
      if (val) {
        this.isLaserReadyBin = false;
        this.verifyAndOpenBin(val);
        event.target.value = '';
      }
    },

    activateMachineSensorItem() {
      this.isLaserReadyItem = true;
      this.$nextTick(() => {
        const input = this.$refs.machineInputCatcherItem as HTMLInputElement;
        if (input) input.focus();
      });
    },
    refocusIfActiveItem() {
      if (this.isLaserReadyItem) {
        setTimeout(() => {
          const input = this.$refs.machineInputCatcherItem as HTMLInputElement;
          if (input) input.focus();
        }, 150);
      }
    },
    handleMachineScanItem(event: any) {
      const val = event.target.value;
      if (val) {
        this.isLaserReadyItem = false;
        // This calls the exact same method your camera uses!
        this.verifyAndOpenItem(val); 
        event.target.value = '';
      }
    },

    async openInlineItemSearch(task: any, context: 'enter' | 'change') {
      this.inlineSearchTask = task;
      this.inlineSearchContext = context;
      this.itemSearchQuery = '';
      this.productList = [];
      this.showInlineItemSearch = true;
      await this.loadAllProducts();
    },

    async handleItemSearch() {
      if (!this.itemSearchQuery.trim()) { await this.loadAllProducts(); return; }
      this.isFetchingProducts = true;
      try {
        const res = await pick.searchProducts(this.itemSearchQuery);
        this.productList = Array.isArray(res) ? res : (res?.data || res?.response || []);
      } catch { this.showToast('Search failed', 'danger'); }
      finally { this.isFetchingProducts = false; }
    },

  async selectNewItemInline(prod: any) {
  const task = this.inlineSearchTask;
  if (!task) return;

  this.isFetchingProducts = true;
  
  try {
    const res = await pick.getProductSpecificInfo(prod.PRODUCT_SYS_ID);
    
    // According to your JSON: res.status is "true" and data is in res.response[0]
    if (res && res.status === "true" && res.response && res.response.length > 0) {
      const specificData = res.response[0];

      // Determine Change vs Enter context
      if (this.inlineSearchContext === 'change') {
        task._isChangingItem = true;
        task._originalHadNoProduct = false;
      } else {
        task._isChangingItem = false;
        task._originalHadNoProduct = true;
      }

      // 1. Basic Info
      task._pendingNewProduct = specificData; 
      task.PRODUCT_NAME = specificData.PRODUCT_NAME;
      task.PART_NO = specificData.PART_NO;
      
      // 2. Handle UOM Logic from MEASUREMENT_DETAILS
      if (specificData.MEASUREMENT_DETAILS && specificData.MEASUREMENT_DETAILS.length > 0) {
        // Find the Default UOM (where IS_DEFAULT is 1)
        const defaultUomObj = specificData.MEASUREMENT_DETAILS.find((m: any) => m.IS_DEFAULT === 1);
        // Find the Lowest UOM (usually where QUANTITY_TO is "1")
        const lowestUomObj = specificData.MEASUREMENT_DETAILS.find((m: any) => m.QUANTITY_TO === "1") 
                             || specificData.MEASUREMENT_DETAILS[specificData.MEASUREMENT_DETAILS.length - 1];

        task.UOM = defaultUomObj ? defaultUomObj.UOM : specificData.MEASUREMENT_DETAILS[0].UOM;
        task.LOWEST_UOM = lowestUomObj ? lowestUomObj.UOM : task.UOM;
      } else {
        // Fallback if no measurement details found
        task.UOM = 'PCS.';
        task.LOWEST_UOM = 'EA';
      }

      // 3. Reset Drafts
      task._draftQty = null;
      task._draftQty2 = null;
      task._draftUom2 = task.LOWEST_UOM; // Sets the dropdown to the new lowest UOM
      task.isCompleted = false;

      // 4. Close UI
      this.showInlineItemSearch = false;
      this.inlineSearchTask = null;
      this.saveDraft();
    } else {
      this.showToast('Product details not found', 'warning');
    }
  } catch (error) {
    console.error("Error fetching specific product details:", error);
    this.showToast('Failed to load product details', 'danger');
  } finally {
    this.isFetchingProducts = false;
  }
},

    skipBin() {
      this.itemsInSelectedBin.forEach(task => { task._isSkipped = true; });
      this.saveDraft();
      
      const idx = this.bins.findIndex(b => b.name === this.selectedBinName);
      const remaining = this.bins.filter(b => b.status !== 'Done' && b.status !== 'Skipped' && b.name !== this.selectedBinName);
      if (remaining.length > 0) {
        const nextIdx = this.bins.findIndex((b, i) => i > idx && b.status !== 'Done' && b.status !== 'Skipped');
        const nextBin = nextIdx !== -1 ? this.bins[nextIdx] : remaining[0];
        this.openBin(nextBin.name);
      } else {
        this.goToStep('gate');
        this.showToast('Bin skipped!', 'warning');
      }
    },

    doneAndNextBin() {
      // Process pending drafted quantities before leaving the bin auto validation
      this.itemsInSelectedBin.forEach(task => {
        const hasQty1 = task._draftQty !== null && task._draftQty !== '';
        const hasQty2 = task._draftQty2 !== null && task._draftQty2 !== '';
  
        if (!task.isCompleted && task.PRODUCT_NAME && (hasQty1 || hasQty2)) {
          task.countedQty = task._draftQty || 0;
          task.countedUom = task.UOM;
          task.countedQty2 = task._draftQty2 || 0;
          task.countedUom2 = task._draftUom2 || task.LOWEST_UOM || 'EA';
          task.isCompleted = true;

          task._isSkipped = false; 
        }
      });
      this.saveDraft();

      const idx = this.bins.findIndex(b => b.name === this.selectedBinName);
      const remaining = this.bins.filter(b => b.status !== 'Done' && b.status !== 'Skipped' && b.name !== this.selectedBinName);
      if (remaining.length > 0) {
        const nextIdx = this.bins.findIndex((b, i) => i > idx && b.status !== 'Done' && b.status !== 'Skipped');
        const nextBin = nextIdx !== -1 ? this.bins[nextIdx] : remaining[0];
        this.openBin(nextBin.name);
      } else {
        this.goToStep('gate');
        this.showToast('All bins completed!', 'success');
      }
    },

    initContext() {
      const rawData = localStorage.getItem('scanData');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const data = Array.isArray(parsed) ? parsed[0] : parsed;
          this.warehouseId = data.BRANCH_NAME_SYS_ID || '1';
          this.warehouseName = data.WAREHOUSE_NAME || data.COMPANY_NAME || 'Main Warehouse';
          this.rackno = data.RACK_NO 
        } catch {}
      }
    },
    async fetchAllPlans() {
      this.isLoading = true;
      try {
        const res = await pick.getCyclePlans(this.warehouseId);
        let data = Array.isArray(res) ? res : (res?.data || res?.response || []);
        if (typeof data === 'string') data = [];
        this.allPlans = data;
      } catch { this.showToast('Failed to load plans', 'danger'); this.allPlans = []; }
      finally { this.isLoading = false; }
    },
    selectPlan(plan: any) {
      this.showAllBins = false;
      this.hasStartedCounting = false; // Reset counting state for a newly opened plan
      this.planSubmitted = plan.PLAN_STATUS === 'Completed';
      this.planNo = String(plan.PLAN_SYS_ID);
      this.planName = plan.PLAN_NAME || `Plan #${plan.PLAN_SYS_ID}`;
      this.selectedPlanObj = plan;
      if (plan.TASK_DETAILS) {
        this.tasks = plan.TASK_DETAILS.map((t: any) => {
          const isCompleted = t.COUNT_QTY !== null && t.COUNT_QTY !== '';

          const lowestUom = t.LOWEST_UOM || 'EA';
          const defaultUom = t.DEFAULT_UOM || t.UOM || 'CTN';

          let countedQty = 0;
          let countedUom = defaultUom;
          let countedQty2 = 0;
          let countedUom2 = lowestUom
          // let countedQty = 0;
          if (isCompleted) {
             const matches = [...String(t.COUNT_QTY).matchAll(/(-?\d+)\s+([A-Za-z0-9.]+)/g)];
  if (matches[0]){
countedQty = parseInt(matches[0][1], 10);
countedUom = matches[0][2];
  } 
  if (matches[1]) {
    countedQty2 = parseInt(matches[1][1], 10);
    countedUom2 = matches[1][2];
  }

          }
          
         

          return {
            ...t,
            isCompleted,
            countedQty,
            countedUom,
            countedQty2,
            countedUom2,
            _draftQty: isCompleted ? countedQty : null,
            _draftQty2: isCompleted && countedQty2 ? countedQty2 : null,
            _draftUom2: countedUom2, // default dropdown to lowest UOM
            UOM: defaultUom,
            LOWEST_UOM: lowestUom,
            PRODUCT_NAME: (t.PRODUCT_NAME && t.PRODUCT_NAME.trim() !== '') ? t.PRODUCT_NAME : null,
            _originalHadNoProduct: !(t.PRODUCT_NAME && t.PRODUCT_NAME.trim() !== ''),
            _isChangingItem: false,
            _pendingNewProduct: null,
            _isSkipped: false,
          };
        });
      } else { this.tasks = []; }
      this.restoreDraft();
      // Navigate directly into the counting interface (gate)
      this.goToStep('gate');
    },

    startCountingAction() {
      this.hasStartedCounting = true;
    },

async startCameraScan(type: 'bin' | 'item') {
  try {
    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera !== 'granted' && camera !== 'limited') return;

    const result = await BarcodeScanner.scan();

    if (result?.barcodes?.length) {
      const binName = result.barcodes[0].rawValue;

      // alert(`Scanned value: ${binName}`);
       this.verifyAndOpenBin(binName);
      // if (type === 'bin') {
      //   this.verifyAndOpenBin(binName);
      // } else {
      //   this.verifyAndOpenItem(binName);
      // }
    } else {
      this.showToast('No barcode detected', 'warning');
    }
  } catch (err) {
    console.error('Scan error:', err);
    this.showToast('Camera not available', 'danger');
  }
},
    async verifyAndOpenBin(binName: string) {
//  alert(`Scanned value2222: ${binName}`);
      binName = binName 
      if (!binName) return;
       const matchedBin = this.bins.find(b => b.name.toUpperCase() === binName);
        if (!matchedBin) {
        return this.showToast('Bin not in plan', 'warning');
      }
      // const exists = this.bins.some(b => b.name === binName);
      // if (!exists) return this.showToast('Bin not in plan', 'warning');
      try {
        const valid = await pick.verifyBinScan(binName, this.warehouseId);
          console.log(valid, 'response');
      const responseData = Array.isArray(valid) ? valid : (valid?.data || valid?.response || []);
         if (responseData && responseData.length > 0) { 
          this.showToast('Bin verified!', 'success');
          this.openBin(matchedBin.name);
        } else { 
          this.showToast('Invalid bin location', 'danger'); 
        }
      } catch { this.showToast('Network error', 'danger'); }
    },
    verifyAndOpenItem(itemName: string) {
       const scannedVal = itemName.trim().toUpperCase();
      if (this.showInlineItemSearch) { 
        this.itemSearchQuery = itemName;
        this.handleItemSearch();
        return;
      }
     const item = this.itemsInSelectedBin.find(i => 
        (i.PART_NO && i.PART_NO.toUpperCase().includes(scannedVal)) || 
        (i.PRODUCT_NAME && i.PRODUCT_NAME.toUpperCase().includes(scannedVal))
      );
      if (item) {
        this.showToast('Item found!', 'success');
        this.openBin(this.selectedBinName);      
      } else {
        this.showToast('Item not in this bin', 'warning');
      }
    },

    getTasksForBin(binName: string): any[] {
      return this.tasks.filter(t => t.BIN_NAME === binName);
    },


    async finalSubmit() {
      if (this.isSubmitting || !this.allItemsHaveData || this.planSubmitted) return;
      const completedTasks = this.tasks.filter(t => t.isCompleted && !t._isSkipped);

        this.isSubmitting = true;

        if (this.selectedPlanObj && this.selectedPlanObj.PLAN_STATUS === 'Not Started') {
        try {
          const statusPayload = {
            ITEM: 'UPDATE_PLAN_STATUS',
            PLAN_SYS_ID: String(this.planNo)
          };
          await pick.updatePlanStatus(statusPayload);
          
          this.selectedPlanObj.PLAN_STATUS = 'In Progress'; 
        } catch (error) {
          console.error("Failed to update plan status to in-progress:", error);
      
        }
      }
      
      if (completedTasks.length === 0) {
        // If all items were skipped, we don't have anything to submit to API.
        // Let's just mark it as successful.
        this.clearDraft();
        this.showToast('All bins skipped, no submit needed.', 'success');
        this.planSubmitted = true;
        setTimeout(() => { this.goToStep(0); }, 1000);
        return;
      }
      this.isSubmitting = true;
      let allOk = true;

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const currentDateTime = `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;

      for (const task of completedTasks) {
        const qty = task.countedQty;
        const newProd = task._pendingNewProduct;
        const uom = newProd?.UOM || task.UOM || 'CTN';
        
       let finalCountQty = "";
        let finalCountQtyWithoutUom = "";

        if (qty !== 0) {
          finalCountQty = `${qty} ${uom}`;
          finalCountQtyWithoutUom = String(qty);
        }

        if (task.countedQty2 && task.countedQty2 !== 0) {
          if (finalCountQty !== "") {
            finalCountQty += ` ${task.countedQty2} ${task.countedUom2}`;
            finalCountQtyWithoutUom += `, ${task.countedQty2}`;
          } else {
            // Only secondary quantity was entered
            finalCountQty = `${task.countedQty2} ${task.countedUom2}`;
            finalCountQtyWithoutUom = String(task.countedQty2);
          }
        }

        if (finalCountQty === "") {
            finalCountQty = `0 ${uom}`;
            finalCountQtyWithoutUom = "0";
        }

        let payload: any;

        if (newProd && task._originalHadNoProduct) {
          payload = {
            ITEM: 'ENTER_ITEM',
            GENERATE_CC_SYS_ID: task.GENERATE_CC_SYS_ID,
            BIN_SYS_ID: String(task.BIN_SYS_ID),
            PRODUCT_SYS_ID: String(newProd.PRODUCT_SYS_ID),
            PRODUCT_NAME: newProd.PRODUCT_NAME || newProd.PRODUCT_CODE,
            COUNT_QTY: finalCountQty,
            COUNT_QTY_WITHOUT_UOM: finalCountQtyWithoutUom,
            COMPLETED_DATE_AND_TIME: currentDateTime
          };
        } else if (newProd && task._isChangingItem) {
          payload = {
            ITEM: 'CHANGE_ITEM',
            GENERATE_CC_SYS_ID: task.GENERATE_CC_SYS_ID,
            BIN_SYS_ID: String(task.BIN_SYS_ID),
            ACTUAL_PRODUCT_SYS_ID: String(newProd.PRODUCT_SYS_ID),
            ACTUAL_PRODUCT_NAME: newProd.PRODUCT_NAME || newProd.PRODUCT_CODE,
            COUNT_QTY: finalCountQty,
            COUNT_QTY_WITHOUT_UOM: finalCountQtyWithoutUom,
            COMPLETED_DATE_AND_TIME: currentDateTime
          };
        } else {
          payload = {
            ITEM: 'ADD_COUNT_QTY',
            GENERATE_CC_SYS_ID: task.GENERATE_CC_SYS_ID,
            BIN_SYS_ID: task.BIN_SYS_ID,
            COUNT_QTY: finalCountQty,
            COUNT_QTY_WITHOUT_UOM: finalCountQtyWithoutUom,
            COMPLETED_DATE_AND_TIME: currentDateTime
          };
        }

        try {
          await pick.addCycleCountQty(payload);
          task._pendingNewProduct = null;
          task._isChangingItem = false;
          task._originalHadNoProduct = false;
        } catch { allOk = false; }
      }

      this.isSubmitting = false;
      if (allOk) {
        this.clearDraft();
        this.showToast('All counts submitted successfully', 'success');
        this.planSubmitted = true;
        setTimeout(() => { this.goToStep(0); }, 1000);
      } else {
        this.showToast('Some items failed to submit', 'danger');
      }
    },

    async loadAllProducts() {
      this.isFetchingProducts = true;
      try {
        const res = await pick.getItemList();
        this.productList = Array.isArray(res) ? res : (res?.data || res?.response || []);
      } catch { this.showToast('Failed to load products', 'danger'); }
      finally { this.isFetchingProducts = false; }
    },

    scrollToManualList() {
      const el = document.getElementById('manual-bin-list');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    
    goToStep(step: number | string) { 
      this.currentStep = step; 
      this.isLaserReadyBin = false; 
      this.showInlineItemSearch = false; 
      window.scrollTo(0, 0); 
    },
    
    goBackFromBinDetail() {
      // Return to gate page and keep counting interface active
      this.hasStartedCounting = true;
      this.goToStep('gate');
    },
    
    openBin(bin: string) { 
      this.selectedBinName = bin; 
      this.showInlineItemSearch = false; 
      this.goToStep(2); 
    },

    async showToast(msg: string, color: 'danger' | 'warning' | 'success') {
      const t = await toastController.create({ message: msg, duration: 2000, color, position: 'top' });
      await t.present();
    },

    getBinBarClass(s: string) { return s === 'Done' ? 'bar-green' : s === 'Partial' ? 'bar-amber' : s === 'Skipped' ? 'bar-purple' : 'bar-grey'; },
    getBinPill(s: string)     { return s === 'Done' ? 'pill-green' : s === 'Partial' ? 'pill-amber' : s === 'Skipped' ? 'pill-purple' : 'pill-grey'; },
    getBinRowClass(s: string) { return s === 'Pending' ? 'bin-row--pending' : ''; },
    getBinSubtext(b: any)     { return b.status === 'Done' ? 'completed' : b.status === 'Partial' ? `${b.countedItems} counted` : 'pending'; },
    getPlanPill(s: string)    { return s === 'Completed' ? 'pill-green' : s === 'In Progress' ? 'pill-amber' : 'pill-blue'; },
  }
});
</script>

<style scoped>
.cc-root {
  --ink: #0f0f0f;
  --ink2: #5a5a5a;
  --ink3: #9a9a9a;
  --surface: #ffffff;
  --surface2: #f7f7f5;
  --surface3: #f0efeb;
  --border: rgba(0,0,0,0.09);
  --green: #16a34a;
  --green-bg: #dcfce7;
  --amber: #d97706;
  --amber-bg: #fef3c7;
  --blue: #2563eb;
  --blue-bg: #dbeafe;
  --grey-bg: #f3f4f6;
  --grey-txt: #6b7280;
  --pending-bg: #fff7ed;
  --pending-border: #fed7aa;
  --pending-txt: #c2410c;
  --red: #dc2626;
  --red-bg: #fee2e2;
  --r-sm: 10px;
  --r-md: 14px;
  --r-lg: 20px;
  background: var(--surface);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.cc-wrap { width: 100%;  max-width:800px; margin: 0 auto; height: 100vh; min-height: 100dvh; background: var(--surface); position: relative; overflow: hidden;display: flex;
  flex-direction: column; }
.screen { display: flex; flex-direction: column; flex: 1;
  height: 100%; overflow: hidden; }
.screen-body { flex: 1; overflow-y: auto; padding: 12px 22px 28px; }

.slide-enter-active, .slide-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to   { opacity: 0; transform: translateX(-20px); }

/* TOPBAR */
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px 10px; background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; }
.topbar-brand { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; letter-spacing: -0.3px; color: var(--ink); }
.brand-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink); }
.topbar-title { font-size: 14px; font-weight: 600; color: var(--ink); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.back-btn { display: flex; align-items: center; gap: 4px; background: transparent; border: none; font-size: 15px; font-weight: 500; color: var(--blue); padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.icon-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface3); border: none; display: flex; align-items: center; justify-content: center; color: var(--ink); cursor: pointer; }

/* HERO */
.page-hero { padding: 24px 0 20px; }
.eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink3); margin: 0 0 6px; }
.display-title { font-size: 28px; font-weight: 700; color: var(--ink); letter-spacing: -0.6px; margin: 0; line-height: 1.15; }

/* SECTION HEADER */
.section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.section-title { font-size: 12px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink3); }
.section-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; border-radius: 100px; font-size: 11px; font-weight: 700; padding: 0 6px; }
.badge-pending { background: var(--pending-bg); color: var(--pending-txt); border: 1px solid var(--pending-border); }
.badge-done    { background: var(--green-bg); color: var(--green); }

/* PILLS */
.pill { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.pill-green { background: var(--green-bg); color: var(--green); }
.pill-amber { background: var(--amber-bg); color: var(--amber); }
.pill-blue  { background: var(--blue-bg);  color: var(--blue); }
.pill-purple { background: #f3e8ff; color: #7e22ce; }
.pill-grey  { background: #f3f4f6; color: #4b5563; }

/* PLAN LIST */
.plan-list { display: flex; flex-direction: column; gap: 12px; }
.plan-card { border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; cursor: pointer; transition: transform 0.12s, box-shadow 0.12s; background: var(--surface); }
.plan-card:active { transform: scale(0.98); box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
/* Pending plan card has orange-tinted left border accent */
.plan-card--pending { border-left: 4px solid var(--amber); background: linear-gradient(to right, #fffbf5 0%, var(--surface) 60%); }
/* Completed plan card — subtle green accent */
.plan-card--completed { border-left: 4px solid var(--green); opacity: 0.82; }
.plan-card-inner { display: flex; align-items: center; padding: 16px; gap: 14px; }
.plan-body { flex: 1; min-width: 0; }
.plan-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.plan-meta { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--ink3); margin-bottom: 5px; background: var(--surface3); border-radius: 6px; padding: 3px 8px; }
.plan-assign { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--ink2); }
.plan-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.arrow-ico { color: var(--ink3); }

/* GATE SCREEN */
.gate-body { display: flex; flex-direction: column; flex: 1; padding-top: 24px; }

/* Counting Interface */
.counting-interface {
  padding: 0;
}

/* Disabled Content Class */
.content-disabled {
  opacity: 0.4;
  pointer-events: none;
  user-select: none;
  filter: grayscale(20%);
  transition: all 0.3s ease;
}

.gate-footer-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

/* PROGRESS */
.progress-panel { display: flex; align-items: center; gap: 20px; background: var(--surface2); border-radius: var(--r-lg); padding: 16px 20px; margin-bottom: 24px; }
.progress-ring-wrap { position: relative; flex-shrink: 0; }
.progress-ring { display: block; }
.ring-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 15px; font-weight: 700; color: var(--ink); }
.progress-stats { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.stat-pill { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.green-dot  { background: var(--green); }
.orange-dot { background: var(--amber); }
.purple-dot { background: #a855f7; }
.grey-dot   { background: #d1d5db; }
.stat-count { font-weight: 700; color: var(--ink); min-width: 20px; }
.stat-lbl   { color: var(--ink2); }

/* SCANNER */
.scanner-block { text-align: center; margin-bottom: 24px; }
.scanner-frame { position: relative; width: 100%; height: 110px; border-radius: var(--r-lg); background: #111827; overflow: hidden; cursor: pointer; transition: border 0.2s; border: 2px solid transparent; }
.scanner-frame.active { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(37,99,235,0.15); }
.corner { position: absolute; width: 16px; height: 16px; border: 2.5px solid var(--blue); }
.corner.tl { top: 10px; left: 10px; border-right: none; border-bottom: none; border-radius: 2px 0 0 0; }
.corner.tr { top: 10px; right: 10px; border-left: none; border-bottom: none; border-radius: 0 2px 0 0; }
.corner.bl { bottom: 10px; left: 10px; border-right: none; border-top: none; border-radius: 0 0 0 2px; }
.corner.br { bottom: 10px; right: 10px; border-left: none; border-top: none; border-radius: 0 0 2px 0; }
.laser-line { position: absolute; left: 10px; right: 10px; height: 2px; background: var(--blue); box-shadow: 0 0 8px var(--blue); animation: laserSweep 1.8s ease-in-out infinite; }
@keyframes laserSweep { 0% { top: 20%; } 50% { top: 78%; } 100% { top: 20%; } }
.scanner-inner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.scanner-inner svg { color: rgba(255,255,255,0.45); }
.scan-pulse { color: var(--blue) !important; opacity: 1 !important; animation: iconPulse 1s ease-in-out infinite; }
@keyframes iconPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
.scanner-label { color: rgba(255,255,255,0.75); font-size: 10px; font-weight: 700; letter-spacing: 0.08em; }
.alt-scan-btn { display: inline-block; margin-top: 8px; font-size: 12px; font-weight: 600; color: var(--blue); background: transparent; border: none; cursor: pointer; }
.ghost-input { position: fixed; top: -200px; left: -200px; width: 1px; height: 1px; opacity: 0; z-index: -1; }

/* BIN LIST */
.bin-list { display: flex; flex-direction: column; gap: 12px; }
.bin-card { 
  display: flex; align-items: center; gap: 12px; padding: 16px; 
  background: #ffffff; border: 1px solid var(--border); border-radius: 12px; 
  cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: all 0.2s;
}
.bin-card:active { transform: scale(0.98); }
.bin-card--Pending { border-left: 5px solid var(--amber); background: linear-gradient(to right, #fffcf0, #fff); }
.bin-card--Partial { border-left: 5px solid var(--blue); background: linear-gradient(to right, #f0f7ff, #fff); }
.bin-card--Done { border-left: 5px solid var(--green); background: linear-gradient(to right, #f2fcf5, #fff); opacity: 0.8; }
.bin-card--Skipped { border-left: 5px solid #a855f7; background: linear-gradient(to right, #faf5ff, #fff); opacity: 0.8; }
.bin-status-bar { display: none; } 
.bin-info { flex: 1; min-width: 0; }
.bin-name { font-size: 15px; font-weight: 600; color: var(--ink); }
.bin-sub  { font-size: 13px; color: var(--ink2); margin-top: 2px; }
.more-btn { background: none; border: none; font-size: 13px; font-weight: 600; color: var(--blue); padding: 12px 0 4px; cursor: pointer; text-align: center; width: 100%; }

/* ITEM CARDS */
.scan-bar-compact { display: flex; align-items: center; gap: 10px; background: var(--surface2); border-radius: var(--r-md); padding: 12px 14px; margin-bottom: 24px; font-size: 14px; color: var(--ink2); }
.scan-bar-compact svg { color: var(--ink3); flex-shrink: 0; }
.scan-bar-compact span { flex: 1; }
.scan-pill-btn { background: var(--ink); color: #fff; border: none; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; padding: 6px 14px; cursor: pointer; flex-shrink: 0; }

.item-list { display: flex; flex-direction: column; gap: 12px; }
.item-card { 
  display: flex; 
  background: #ffffff; 
  border: 1px solid rgba(0,0,0,0.06); 
  border-radius: 16px; 
  box-shadow: 0 6px 16px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02);
  margin-bottom: 12px;
  overflow: hidden; 
  transition: all 0.2s ease; 
}
.item-card:hover {
  box-shadow: 0 10px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.03);
  transform: translateY(-2px);
}
.item-done { opacity: 0.72; }
.item-accent { width: 6px; flex-shrink: 0; }
.accent-green { background: var(--green); }
.accent-amber { background: var(--amber); }
.item-card-body { flex: 1; padding: 14px 14px 14px 12px; }
.item-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.item-name { font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.3; margin-bottom: 3px; }
.item-name-part-no { color: var(--ink3); font-weight: normal; font-size: 13px; margin-left: 6px; }
.item-empty { color: var(--ink3); font-style: italic; font-weight: 400; }
.item-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink2); flex-wrap: wrap; margin-top: 4px; }
.sep { color: var(--ink3); }
.item-code-wrap { display: inline-flex; align-items: center; gap: 4px; }
.item-code-label { font-size: 11px; color: var(--ink3); font-weight: 500; }
.item-code { font-family: 'SF Mono', 'Menlo', monospace; color: var(--blue); font-size: 11px; font-weight: 500; background: var(--blue-bg); padding: 2px 6px; border-radius: 4px; }

/* QTY ROW — FORCED SAME LINE */
.inline-qty-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; flex-wrap: nowrap; overflow: hidden; }
.qty-group { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.qty-input-manual {
  width: 72px; /* Slimmer input */
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  outline: none;
  padding: 0 4px;
}
.uom-select {
  width: 65px; /* Slimmer dropdown */
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  outline: none;
  padding: 0 4px 0 8px;
  cursor: pointer;
  appearance: auto;
}
.premium-input {
  border: 2px solid var(--border);
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  background: #fafafa;
  transition: all 0.2s;
  height: 40px; /* Matched sleek height */
}
.premium-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 4px rgba(37,99,235,0.1), inset 0 2px 4px rgba(0,0,0,0.02);
  background: #fff;
}
.qty-input-manual::placeholder { font-size: 13px; font-weight: 400; color: var(--ink3); text-align: center; }
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.qty-uom { font-size: 13px; color: var(--ink2); font-weight: 600; padding: 0 2px; }

/* Done row */
.done-qty-row { display: flex; align-items: center; gap: 8px; font-size: 13px; padding-top: 4px; flex-wrap: wrap; }
.done-check-inline { width: 18px; height: 18px; border-radius: 50%; background: var(--green-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.done-check-inline svg { color: var(--green); }
.done-qty-label { color: var(--ink3); }
.done-qty-val { font-weight: 700; color: var(--green); }

/* ITEM ACTION ROW */
.item-action-row { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); }
.change-item-btn { 
  background: var(--amber-bg); 
  border: 1px solid rgba(217,119,6,0.2); 
  border-radius: 6px; 
  padding: 6px 14px; 
  font-size: 12px; 
  font-weight: 600; 
  color: var(--amber); 
  cursor: pointer; 
  -webkit-tap-highlight-color: transparent; 
  transition: all 0.15s; 
}
.change-item-btn:active { 
  background: rgba(217,119,6,0.25); 
  transform: scale(0.97); 
}
.enter-item-btn { background: var(--amber-bg); color: var(--amber); border: none; border-radius: var(--r-sm); padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer; width: 100%; text-align: center; }

/* INLINE ITEM SEARCH PANEL (NESTED IN ITEM CARD) */
.inline-item-search-panel {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 12px;
}
.inline-search-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.inline-search-title { font-size: 13px; font-weight: 700; color: var(--ink); text-transform: uppercase; letter-spacing: 0.05em; }
.inline-scan-row { margin-bottom: 12px; }
.inline-scan-btn { display: inline-flex; align-items: center; gap: 6px; background: var(--blue-bg); color: var(--blue); border: none; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; justify-content: center; }
.modal-search { display: flex; align-items: center; gap: 10px; background: var(--surface); border-radius: var(--r-md); padding: 0 10px; margin: 0 0 12px; border: 1px solid var(--border); }
.modal-search svg { color: var(--ink3); flex-shrink: 0; }
.modal-search-input { flex: 1; border: none; background: transparent; font-size: 14px; color: var(--ink); padding: 10px 0; outline: none; }
.modal-current-item { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--amber-bg); border-radius: var(--r-md); font-size: 13px; }
.modal-current-label { color: var(--amber); font-weight: 600; flex-shrink: 0; }
.modal-current-name { color: var(--ink); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.modal-list { flex: 1; overflow-y: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; }
.prod-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid var(--border); cursor: pointer; }
.prod-row:last-child { border-bottom: none; }
.prod-info { flex: 1; min-width: 0; }
.prod-name { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
.prod-meta { display: flex; align-items: center; gap: 8px; }
.empty-modal { text-align: center; padding: 24px; color: var(--ink3); font-size: 14px; }

/* SUMMARY (STEP 4) */
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
.summary-card { background: var(--surface2); border-radius: var(--r-lg); padding: 16px; }
.summary-label { font-size: 12px; color: var(--ink2); font-weight: 500; margin: 0 0 6px; }
.summary-big { font-size: 32px; font-weight: 800; color: var(--ink); letter-spacing: -1px; margin: 0 0 10px; line-height: 1; }
.summary-of { font-size: 18px; font-weight: 400; color: var(--ink3); }
.bin-summary-block { margin-bottom: 12px; border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; }
.bin-summary-header { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--surface2); }
.bin-summary-name { font-size: 14px; font-weight: 700; color: var(--ink); flex: 1; }
.bin-summary-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.bin-summary-count { font-size: 12px; color: var(--ink3); font-weight: 500; }

/* FINAL SUBMIT (STEP 5) */
.warning-banner { display: flex; align-items: flex-start; gap: 10px; background: var(--amber-bg); border-radius: var(--r-md); padding: 12px 14px; margin-bottom: 20px; font-size: 13px; color: var(--amber); font-weight: 500; line-height: 1.4; }
.warning-banner svg { flex-shrink: 0; margin-top: 1px; }
.submit-stats-row { display: flex; align-items: center; background: var(--surface2); border-radius: var(--r-lg); padding: 16px 20px; margin-bottom: 24px; }
.submit-stat { flex: 1; text-align: center; }
.submit-stat-num { display: block; font-size: 28px; font-weight: 800; color: var(--ink); letter-spacing: -0.5px; }
.submit-stat-lbl { font-size: 12px; color: var(--ink3); font-weight: 500; }
.submit-stat-divider { width: 1px; height: 36px; background: var(--border); flex-shrink: 0; }
.num-green { color: var(--green); }
.num-amber { color: var(--amber); }
.fs-bin-block { margin-bottom: 16px; border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; }
.fs-bin-header { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--surface2); border-bottom: 1px solid var(--border); }
.fs-bin-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.fs-bin-name { font-size: 15px; font-weight: 700; color: var(--ink); flex: 1; }
.fs-item-row { display: flex; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); }
.fs-item-row:last-child { border-bottom: none; }
.fs-item-left { flex: 1; min-width: 0; }
.fs-item-name { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fs-item-empty { color: var(--ink3); font-style: italic; font-weight: 400; }
.fs-item-meta { display: flex; align-items: center; gap: 4px; font-size: 12px; }
.fs-item-right { flex-shrink: 0; margin-left: 12px; }
.fs-qty { font-size: 16px; font-weight: 700; color: var(--green); text-align: right; }
.fs-uom { font-size: 12px; font-weight: 400; color: var(--ink3); }
.fs-missing { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: var(--red); }

/* BOTTOM ACTIONS */
.screen-foot { padding: 16px 22px 34px; background: var(--surface); border-top: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.two-btn-foot { flex-direction: row; gap: 12px; }
.bin-detail-foot { gap: 8px; }
.foot-hint { font-size: 12px; color: var(--ink3); margin: 0; }
.warn-hint { color: var(--amber); font-weight: 500; }
.primary-btn { display: flex; align-items: center; gap: 6px; background: var(--ink); color: #fff; border: none; border-radius: var(--r-md); padding: 14px 22px; font-size: 15px; font-weight: 600; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: transform 0.1s; white-space: nowrap; justify-content: center; }
.primary-btn:active { transform: scale(0.97); }
.full-btn { width: 100%; }
.half-btn { flex: 1; }
.btn-disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
.ghost-action-btn { background: transparent; border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px 20px; font-size: 15px; font-weight: 500; color: var(--ink); cursor: pointer; white-space: nowrap; text-align: center; }
.done-next-btn { background: #16a34a; }
.submit-btn { background: #16a34a; }

/* LOADER */
.loader-wrap { display: flex; justify-content: center; padding: 48px 0; color: var(--blue); }
.empty-card { background: var(--surface2); border-radius: var(--r-lg); padding: 24px; text-align: center; }
.empty-title { font-size: 16px; font-weight: 600; color: var(--ink); margin: 0; }
 .qty-col { 
  display: flex; 
  flex-direction: column; 
  gap: 5px; 

}
.qty-lbl { 
  font-size: 10px; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 

  
}
/* ══ RESPONSIVE DESKTOP/TABLET STYLES ══ */
@media (min-width: 640px) {
  .cc-wrap {
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    box-shadow: 0 10px 40px rgba(0,0,0,0.06);
    border-radius: 0 0 16px 16px;
  }
  
  .topbar { padding: 18px 32px 14px; }
  .screen-body { padding: 24px 32px 32px; }
  .screen-foot { padding: 20px 32px 36px; }
  
  .scanner-block { max-width: 400px; margin: 0 auto 32px; }


  .plan-list, .bin-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .item-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    align-items: start;
  }

  .fs-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    align-items: start;
  }

  .stacked-qty-row { 
  display: flex; 
  flex-direction: column; 
  gap: 14px; 
  margin-top: 10px; 
}
 
}
</style>