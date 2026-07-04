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

        <!-- ══ STEP 0.5 — START COUNTING GATE ══ -->
        <div v-else-if="currentStep === 'gate'" class="screen" key="sgate">
          <div class="topbar">
            <button class="back-btn" @click="goToStep(0)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="topbar-title">{{ planName }}</span>
          </div>
          <div class="screen-body gate-body">
            <div class="gate-hero">
              <div class="gate-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="28"><path d="M384 400.33l35.13-.33A29 29 0 00448 371.13V140.87A29 29 0 00419.13 112l-35.13.33M128 112l-35.13.33A29 29 0 0064 141.13v230.2A29 29 0 0092.87 400l35.13-.33M384 192v128M320 160v192M256 176v160M192 160v192M128 192v128"/></svg>
              </div>
              <h1 class="gate-title">{{ planName }}</h1>
              <p class="gate-sub">{{ bins.length }} bins · {{ tasks.length }} items</p>
              <div class="gate-meta-row">
                <div class="gate-meta-item">
                  <span class="gate-meta-label">Start Date</span>
                  <span class="gate-meta-val">{{ formatDate(selectedPlanObj?.START_DATE) }}</span>
                </div>
                <div class="gate-meta-divider"></div>
                <div class="gate-meta-item">
                  <span class="gate-meta-label">End Date</span>
                  <span class="gate-meta-val">{{ formatDate(selectedPlanObj?.END_DATE) }}</span>
                </div>
                <div v-if="selectedPlanObj?.ASSIGN_TO" class="gate-meta-divider"></div>
                <div v-if="selectedPlanObj?.ASSIGN_TO" class="gate-meta-item">
                  <span class="gate-meta-label">Assigned To</span>
                  <span class="gate-meta-val">{{ selectedPlanObj.ASSIGN_TO }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="screen-foot">
            <button class="primary-btn full-btn start-count-btn" @click="goToStep(1)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Start Counting
            </button>
          </div>
        </div>

        <!-- ══ STEP 1 — BIN LIST ══ -->
        <div v-else-if="currentStep === 1" class="screen" key="s1">
          <div class="topbar">
            <button class="back-btn" @click="goToStep('gate')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="topbar-title">{{ planName }}</span>
          </div>

          <div class="screen-body">
            <div class="page-hero">
              <p class="eyebrow">{{ bins.length }} bins to count</p>
              <h1 class="display-title">{{ planName }}</h1>
            </div>

            <!-- Progress ring + stats -->
            <div class="progress-panel">
              <div class="progress-ring-wrap">
                <svg class="progress-ring" width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f0f0f0" stroke-width="7"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#22c55e" stroke-width="7"
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
                  <span class="stat-dot orange-dot"></span>
                  <span class="stat-count">{{ partialBinsCount }}</span>
                  <span class="stat-lbl">Partial</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-dot grey-dot"></span>
                  <span class="stat-count">{{ pendingBinsCount }}</span>
                  <span class="stat-lbl">Pending</span>
                </div>
              </div>
            </div>

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
              <div v-for="bin in displayBins" :key="bin.name" class="bin-row" :class="getBinRowClass(bin.status)" @click="openBin(bin.name)">
                <div class="bin-status-bar" :class="getBinBarClass(bin.status)"></div>
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

          <div class="screen-foot" :class="{ 'two-btn-foot': !planSubmitted }">
            <button class="ghost-action-btn" :class="planSubmitted ? 'full-btn' : 'half-btn'" @click="goToStep(4)">View Summary</button>
            <button v-if="!planSubmitted" class="primary-btn half-btn" @click="goToStep(5)">Final Submit</button>
          </div>
        </div>

        <!-- ══ STEP 2 — BIN DETAIL ══ -->
        <div v-else-if="currentStep === 2" class="screen" key="s2">
          <div class="topbar">
            <button class="back-btn" @click="goToStep(1)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="pill" :class="getBinPill(selectedBinData?.status)">{{ selectedBinData?.status }}</span>
          </div>

          <div class="screen-body">
            <div class="page-hero">
              <p class="eyebrow">{{ remainingItemsInBin }} items remaining</p>
              <h1 class="display-title">{{ selectedBinName }}</h1>
            </div>

            <!-- Item search / scan inline on bin detail page (Change Item replacement) -->
            <div v-if="showInlineItemSearch" class="inline-item-search-panel">
              <div class="inline-search-head">
                <span class="inline-search-title">{{ inlineSearchContext === 'enter' ? 'Select Product' : 'Change Item' }}</span>
                <button class="icon-btn" @click="showInlineItemSearch = false; inlineSearchTask = null">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div v-if="inlineSearchContext === 'change' && inlineSearchTask" class="modal-current-item" style="margin:0 0 12px;">
                <span class="modal-current-label">Current:</span>
                <span class="modal-current-name">{{ inlineSearchTask.PRODUCT_NAME }}</span>
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
                    <div class="prod-name">{{ prod.PRODUCT_NAME || prod.PART_NO }}</div>
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

            <div class="section-header">
              <span class="section-title">Items in this bin</span>
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
                        <span v-if="task.ITEM_CATEGORY" class="sep">·</span>
                        <span v-if="task.ITEM_CATEGORY">{{ task.ITEM_CATEGORY }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Inline qty — tasks WITH product and NOT done: manual entry only -->
                  <div v-if="task.PRODUCT_NAME && !task.isCompleted" class="inline-qty-row">
                    <input
                      type="number"
                      class="qty-input qty-input-manual"
                      v-model.number="task._draftQty"
                      inputmode="numeric"
                      placeholder="Enter qty"
                      @click.stop
                    />
                    <span class="qty-uom">{{ task.UOM }}</span>
                    <button class="confirm-item-btn" @click.stop="stageItemConfirm(task)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Confirm
                    </button>
                  </div>

                  <!-- Completed row -->
                  <div v-if="task.isCompleted" class="done-qty-row">
                    <div class="done-check-inline">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="done-qty-label">Counted:</span>
                    <span class="done-qty-val">{{ task.countedQty }} {{ task.UOM }}</span>
                  </div>

                  <!-- No product: Enter product button -->
                  <div v-if="!task.PRODUCT_NAME && !task.isCompleted" class="item-action-row">
                    <button class="enter-item-btn" @click.stop="openInlineItemSearch(task, 'enter')">
                      Enter product →
                    </button>
                  </div>

                  <!-- Has product + not done: Change Item button -->
                  <div v-if="task.PRODUCT_NAME && !task.isCompleted" class="item-action-row">
                    <button class="change-item-btn" @click.stop="openInlineItemSearch(task, 'change')">
                      Change Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="screen-foot bin-detail-foot">
            <p class="foot-hint">{{ remainingItemsInBin === 0 ? 'All items confirmed ✓' : remainingItemsInBin + ' items left' }}</p>
            <button class="primary-btn full-btn done-next-btn" @click="doneAndNextBin">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Done &amp; Next Bin
            </button>
          </div>
        </div>

        <!-- ══ STEP 4 — SUMMARY ══ -->
        <div v-else-if="currentStep === 4" class="screen" key="s4">
          <div class="topbar">
            <button class="back-btn" @click="goToStep(1)">
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
                <p class="summary-big">{{ completedBinsCount }}<span class="summary-of">/{{ bins.length }}</span></p>
                <span class="pill" :class="completedBinsCount === bins.length ? 'pill-green' : 'pill-amber'">
                  {{ completedBinsCount === bins.length ? 'All done' : 'In progress' }}
                </span>
              </div>
              <div class="summary-card">
                <p class="summary-label">Items counted</p>
                <p class="summary-big">{{ totalCountedItems }}<span class="summary-of">/{{ tasks.length }}</span></p>
                <span class="pill" :class="totalCountedItems === tasks.length ? 'pill-green' : 'pill-amber'">
                  {{ tasks.length - totalCountedItems > 0 ? (tasks.length - totalCountedItems) + ' pending' : 'All done' }}
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
            <button class="back-btn" @click="goToStep(4)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back
            </button>
            <span class="topbar-title">Final Submit</span>
          </div>

          <div class="screen-body">
            <div class="page-hero">
              <p class="eyebrow">Review before submitting</p>
              <h1 class="display-title">Final Submit</h1>
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
                  <div class="fs-item-meta" v-if="task.PART_NO">
                    <span class="item-code-label">Part No:</span>
                    <span class="item-code">{{ task.PART_NO }}</span>
                  </div>
                </div>
                <div class="fs-item-right">
                  <span v-if="task.isCompleted" class="fs-qty">{{ task.countedQty }} <span class="fs-uom">{{ task.UOM }}</span></span>
                  <span v-else class="fs-missing">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Missing
                  </span>
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
              {{ isSubmitting ? 'Submitting…' : planSubmitted ? 'Submitted Successfully' : 'Final Submit' }}
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
      planNo: '1',
      planName: '',
      allPlans: [] as any[],
      selectedPlanObj: null as any,
      tasks: [] as any[],
      selectedBinName: '',
      showAllBins: false,
      isLaserReadyBin: false,
      planSubmitted: false,
      // Inline item search (replaces modal)
      showInlineItemSearch: false,
      inlineSearchTask: null as any,
      inlineSearchContext: 'enter' as 'enter' | 'change',
      itemSearchQuery: '',
      productList: [] as any[],
      isFetchingProducts: false,
    };
  },
  computed: {
    lsKey(): string { return LS_KEY_PREFIX + this.planNo; },
    // Split plans by status
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
          map[t.BIN_NAME] = { name: t.BIN_NAME, items: [], totalItems: 0, countedItems: 0, BIN_SYS_ID: t.BIN_SYS_ID };
        }
        map[t.BIN_NAME].items.push(t);
        map[t.BIN_NAME].totalItems++;
        if (t.isCompleted) map[t.BIN_NAME].countedItems++;
      });
      return Object.values(map).map(group => {
        let status = 'Pending';
        if (group.countedItems === group.totalItems && group.totalItems > 0) status = 'Done';
        else if (group.countedItems > 0) status = 'Partial';
        return { ...group, status };
      });
    },
    displayBins(): any[] { return this.showAllBins ? this.bins : this.bins.slice(0, 4); },
    completedBinsCount(): number { return this.bins.filter(b => b.status === 'Done').length; },
    partialBinsCount(): number   { return this.bins.filter(b => b.status === 'Partial').length; },
    pendingBinsCount(): number   { return this.bins.filter(b => b.status === 'Pending').length; },
    progressPercentage(): number {
      if (!this.bins.length) return 0;
      return (this.completedBinsCount / this.bins.length) * 100;
    },
    totalCountedItems(): number { return this.tasks.filter(t => t.isCompleted).length; },
    selectedBinData(): any { return this.bins.find(b => b.name === this.selectedBinName) || {}; },
    itemsInSelectedBin(): any[] { return this.tasks.filter(t => t.BIN_NAME === this.selectedBinName); },
    remainingItemsInBin(): number { return this.itemsInSelectedBin.filter(t => !t.isCompleted).length; },
    allItemsHaveData(): boolean {
      return this.tasks.length > 0 && this.tasks.every(t => t.isCompleted);
    },
    incompleteItemsCount(): number {
      return this.tasks.filter(t => !t.isCompleted).length;
    },
  },
  async mounted() {
    this.planNo = (this.$route.query.planNo as string) || '1';
    this.initContext();
    await this.fetchAllPlans();
  },
  methods: {
    // ── Date formatter: any input → dd-mm-yyyy ──────────────
    formatDate(dateStr: string): string {
      if (!dateStr) return '';
      // Try parsing common formats
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    },

    // ── localStorage persistence ──────────────────────────────
    saveDraft() {
      try {
        const draft = this.tasks.map(t => ({
          id: t.GENERATE_CC_SYS_ID,
          isCompleted: t.isCompleted,
          countedQty: t.countedQty,
          _draftQty: t._draftQty,
          PRODUCT_NAME: t.PRODUCT_NAME,
          UOM: t.UOM,
          _originalHadNoProduct: t._originalHadNoProduct,
          _isChangingItem: t._isChangingItem,
          _pendingNewProduct: t._pendingNewProduct,
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
            t._draftQty   = d._draftQty ?? (d.isCompleted ? d.countedQty : null);
            if (d.PRODUCT_NAME) t.PRODUCT_NAME = d.PRODUCT_NAME;
            if (d.UOM)          t.UOM = d.UOM;
            t._originalHadNoProduct = d._originalHadNoProduct;
            t._isChangingItem       = d._isChangingItem ?? false;
            t._pendingNewProduct    = d._pendingNewProduct ?? null;
          }
        });
      } catch {}
    },
    clearDraft() {
      try { localStorage.removeItem(this.lsKey); } catch {}
    },

    // ── Scanner ───────────────────────────────────────────────
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

    // ── Inline item search (replaces modal) ───────────────────
    async openInlineItemSearch(task: any, context: 'enter' | 'change') {
      this.inlineSearchTask = task;
      this.inlineSearchContext = context;
      this.itemSearchQuery = '';
      this.productList = [];
      this.showInlineItemSearch = true;
      // Auto-load product list
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

    selectNewItemInline(prod: any) {
      this.showInlineItemSearch = false;
      const task = this.inlineSearchTask;
      if (!task) return;

      if (this.inlineSearchContext === 'change') {
        task._isChangingItem = true;
        task._originalHadNoProduct = false;
      } else {
        task._isChangingItem = false;
        task._originalHadNoProduct = true;
      }

      task._pendingNewProduct = prod;
      task.PRODUCT_NAME = prod.PRODUCT_NAME || prod.PRODUCT_CODE;
      task.UOM = prod.UOM || task.UOM || 'CTN';
      task._draftQty = null;
      task.isCompleted = false;
      this.inlineSearchTask = null;
      this.saveDraft();
    },

    // ── Done & Next Bin ───────────────────────────────────────
    doneAndNextBin() {
      // Find next pending/partial bin after current, in order
      const idx = this.bins.findIndex(b => b.name === this.selectedBinName);
      // Look for next bin (wrapping around)
      const remaining = this.bins.filter(b => b.status !== 'Done' && b.name !== this.selectedBinName);
      if (remaining.length > 0) {
        // Pick next bin numerically after current index
        const nextIdx = this.bins.findIndex((b, i) => i > idx && b.status !== 'Done');
        const nextBin = nextIdx !== -1 ? this.bins[nextIdx] : remaining[0];
        this.openBin(nextBin.name);
      } else {
        // All bins done, go back to list
        this.goToStep(1);
        this.showToast('All bins completed!', 'success');
      }
    },

    // ── Init ──────────────────────────────────────────────────
    initContext() {
      const rawData = localStorage.getItem('scanData');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const data = Array.isArray(parsed) ? parsed[0] : parsed;
          this.warehouseId = data.BRANCH_NAME_SYS_ID || '1';
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
      this.planSubmitted = plan.PLAN_STATUS === 'Completed';
      this.planNo = String(plan.PLAN_SYS_ID);
      this.planName = plan.PLAN_NAME || `Plan #${plan.PLAN_SYS_ID}`;
      this.selectedPlanObj = plan;
      if (plan.TASK_DETAILS) {
        this.tasks = plan.TASK_DETAILS.map((t: any) => {
          const isCompleted = t.COUNT_QTY !== null && t.COUNT_QTY !== '';
          let countedQty = 0;
          if (isCompleted) {
            const match = String(t.COUNT_QTY).match(/\d+/);
            if (match) countedQty = parseInt(match[0], 10);
          }
          return {
            ...t,
            isCompleted,
            countedQty,
            _draftQty: isCompleted ? countedQty : null,
            PRODUCT_NAME: (t.PRODUCT_NAME && t.PRODUCT_NAME.trim() !== '') ? t.PRODUCT_NAME : null,
            _originalHadNoProduct: !(t.PRODUCT_NAME && t.PRODUCT_NAME.trim() !== ''),
            _isChangingItem: false,
            _pendingNewProduct: null,
          };
        });
      } else { this.tasks = []; }
      this.restoreDraft();
      // Go to gate screen — user must press Start Counting
      this.goToStep('gate');
    },

    // ── Camera/Barcode ────────────────────────────────────────
    async startCameraScan(type: 'bin' | 'item') {
      try {
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera !== 'granted' && camera !== 'limited') return;
        const result = await BarcodeScanner.scan();
        if (result?.barcodes?.length) {
          const val = result.barcodes[0].rawValue;
          if (type === 'bin') this.verifyAndOpenBin(val);
          else this.verifyAndOpenItem(val);
        }
      } catch { this.showToast('Camera not available', 'danger'); }
    },
    async verifyAndOpenBin(binName: string) {
      binName = binName.trim();
      if (!binName) return;
      const exists = this.bins.some(b => b.name === binName);
      if (!exists) return this.showToast('Bin not in plan', 'warning');
      try {
        const valid = await pick.verifyBinScan(binName, this.warehouseId);
        if (Array.isArray(valid) && valid.length) { this.openBin(binName); }
        else { this.showToast('Invalid bin location', 'danger'); }
      } catch { this.showToast('Network error', 'danger'); }
    },
    verifyAndOpenItem(itemName: string) {
      // If inline search is open, try to find the product
      if (this.showInlineItemSearch) {
        this.itemSearchQuery = itemName;
        this.handleItemSearch();
        return;
      }
      const item = this.itemsInSelectedBin.find(i => i.PRODUCT_NAME?.includes(itemName));
      if (item) this.openBin(this.selectedBinName);
      else this.showToast('Item not in this bin', 'warning');
    },

    // ── Qty helpers ───────────────────────────────────────────
    stageItemConfirm(task: any) {
      if (!task._draftQty && task._draftQty !== 0) {
        this.showToast('Please enter a quantity', 'warning');
        return;
      }
      task.countedQty = task._draftQty || 0;
      task.isCompleted = true;
      this.saveDraft();
    },

    // ── Helper: get tasks grouped by bin ─────────────────────
    getTasksForBin(binName: string): any[] {
      return this.tasks.filter(t => t.BIN_NAME === binName);
    },

    // ── Final submit ──────────────────────────────────────────
    async finalSubmit() {
      if (this.isSubmitting || !this.allItemsHaveData || this.planSubmitted) return;
      const completedTasks = this.tasks.filter(t => t.isCompleted);
      if (completedTasks.length === 0) {
        this.showToast('No items counted to submit', 'warning');
        return;
      }
      this.isSubmitting = true;
      let allOk = true;

      for (const task of completedTasks) {
        const qty = task.countedQty;
        const newProd = task._pendingNewProduct;
        const uom = newProd?.UOM || task.UOM || 'CTN';
        let payload: any;

        if (newProd && task._originalHadNoProduct) {
          payload = {
            ITEM: 'ENTER_ITEM',
            GENERATE_CC_SYS_ID: task.GENERATE_CC_SYS_ID,
            BIN_SYS_ID: String(task.BIN_SYS_ID),
            PRODUCT_SYS_ID: String(newProd.PRODUCT_SYS_ID),
            PRODUCT_NAME: newProd.PRODUCT_NAME || newProd.PRODUCT_CODE,
            COUNT_QTY: `${qty} ${uom}`,
            COUNT_QTY_WITHOUT_UOM: String(qty),
          };
        } else if (newProd && task._isChangingItem) {
          payload = {
            ITEM: 'CHANGE_ITEM',
            GENERATE_CC_SYS_ID: task.GENERATE_CC_SYS_ID,
            BIN_SYS_ID: String(task.BIN_SYS_ID),
            ACTUAL_PRODUCT_SYS_ID: String(newProd.PRODUCT_SYS_ID),
            ACTUAL_PRODUCT_NAME: newProd.PRODUCT_NAME || newProd.PRODUCT_CODE,
            COUNT_QTY: `${qty} ${uom}`,
            COUNT_QTY_WITHOUT_UOM: String(qty),
          };
        } else {
          payload = {
            ITEM: 'ADD_COUNT_QTY',
            GENERATE_CC_SYS_ID: task.GENERATE_CC_SYS_ID,
            BIN_SYS_ID: task.BIN_SYS_ID,
            COUNT_QTY: `${qty} ${uom}`,
            COUNT_QTY_WITHOUT_UOM: String(qty),
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

    // ── Product list ──────────────────────────────────────────
    async loadAllProducts() {
      this.isFetchingProducts = true;
      try {
        const res = await pick.getItemList();
        this.productList = Array.isArray(res) ? res : (res?.data || res?.response || []);
      } catch { this.showToast('Failed to load products', 'danger'); }
      finally { this.isFetchingProducts = false; }
    },

    // ── Navigation ────────────────────────────────────────────
    goToStep(step: number | string) { this.currentStep = step; this.isLaserReadyBin = false; this.showInlineItemSearch = false; window.scrollTo(0, 0); },
    openBin(bin: string) { this.selectedBinName = bin; this.showInlineItemSearch = false; this.goToStep(2); },

    // ── Toast ─────────────────────────────────────────────────
    async showToast(msg: string, color: 'danger' | 'warning' | 'success') {
      const t = await toastController.create({ message: msg, duration: 2000, color, position: 'top' });
      await t.present();
    },

    // ── Style helpers ─────────────────────────────────────────
    getBinBarClass(s: string) { return s === 'Done' ? 'bar-green' : s === 'Partial' ? 'bar-amber' : 'bar-grey'; },
    getBinPill(s: string)     { return s === 'Done' ? 'pill-green' : s === 'Partial' ? 'pill-amber' : 'pill-grey'; },
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

.cc-wrap { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--surface); position: relative; overflow: hidden; }
.screen { display: flex; flex-direction: column; min-height: 100vh; }
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
.pill-grey  { background: var(--grey-bg);  color: var(--grey-txt); }

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
.gate-body { display: flex; align-items: center; justify-content: center; flex: 1; }
.gate-hero { text-align: center; padding: 32px 24px; }
.gate-icon-wrap { width: 88px; height: 88px; border-radius: 24px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--ink2); }
.gate-title { font-size: 24px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; margin: 0 0 6px; }
.gate-sub { font-size: 14px; color: var(--ink3); margin: 0 0 24px; }
.gate-meta-row { display: flex; align-items: center; justify-content: center; gap: 0; background: var(--surface2); border-radius: var(--r-lg); padding: 14px 20px; }
.gate-meta-item { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; }
.gate-meta-label { font-size: 11px; color: var(--ink3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
.gate-meta-val { font-size: 13px; font-weight: 700; color: var(--ink); }
.gate-meta-divider { width: 1px; height: 32px; background: var(--border); flex-shrink: 0; margin: 0 8px; }
.start-count-btn { background: var(--ink); font-size: 17px; padding: 16px 24px; border-radius: var(--r-lg); }

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
.bin-list { display: flex; flex-direction: column; }
.bin-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.bin-row:last-child { border-bottom: none; }
/* Pending bin row gets a warm tint */
.bin-row--pending { background: linear-gradient(to right, #fffbf5 0%, transparent 50%); border-radius: 8px; padding-left: 6px; margin-left: -6px; }
.bin-status-bar { width: 4px; height: 36px; border-radius: 2px; flex-shrink: 0; }
.bar-green { background: var(--green); }
.bar-amber { background: var(--amber); }
.bar-grey  { background: #f97316; } /* orange for pending */
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
.item-card { display: flex; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; transition: opacity 0.2s; }
.item-done { opacity: 0.72; }
.item-accent { width: 4px; flex-shrink: 0; }
.accent-green { background: var(--green); }
.accent-amber { background: var(--amber); }
.item-card-body { flex: 1; padding: 14px 14px 14px 12px; }
.item-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.item-name { font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.3; margin-bottom: 3px; }
.item-empty { color: var(--ink3); font-style: italic; font-weight: 400; }
.item-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink2); flex-wrap: wrap; margin-top: 4px; }
.sep { color: var(--ink3); }
.item-code-wrap { display: inline-flex; align-items: center; gap: 4px; }
.item-code-label { font-size: 11px; color: var(--ink3); font-weight: 500; }
.item-code { font-family: 'SF Mono', 'Menlo', monospace; color: var(--blue); font-size: 11px; font-weight: 500; background: var(--blue-bg); padding: 2px 6px; border-radius: 4px; }

/* QTY ROW — manual entry only, no steppers */
.inline-qty-row { display: flex; align-items: center; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
.qty-input-manual {
  width: 100px;
  height: 40px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface2);
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  outline: none;
  padding: 0 10px;
}
.qty-input-manual:focus { border-color: var(--blue); background: var(--surface); }
.qty-input-manual::placeholder { font-size: 13px; font-weight: 400; color: var(--ink3); }
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.qty-uom { font-size: 13px; color: var(--ink2); font-weight: 500; }
.confirm-item-btn { display: flex; align-items: center; gap: 5px; background: var(--ink); color: #fff; border: none; border-radius: var(--r-sm); padding: 0 14px; height: 40px; font-size: 13px; font-weight: 600; cursor: pointer; margin-left: auto; -webkit-tap-highlight-color: transparent; transition: transform 0.1s; }
.confirm-item-btn:active { transform: scale(0.96); }

/* Done row */
.done-qty-row { display: flex; align-items: center; gap: 8px; font-size: 13px; padding-top: 4px; }
.done-check-inline { width: 18px; height: 18px; border-radius: 50%; background: var(--green-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.done-check-inline svg { color: var(--green); }
.done-qty-label { color: var(--ink3); }
.done-qty-val { font-weight: 700; color: var(--green); }

/* ITEM ACTION ROW */
.item-action-row { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); }
.change-item-btn { background: transparent; border: 1px solid var(--border); border-radius: 6px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: var(--ink2); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background 0.15s; }
.change-item-btn:active { background: var(--surface3); }
.enter-item-btn { background: var(--amber-bg); color: var(--amber); border: none; border-radius: var(--r-sm); padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer; width: 100%; text-align: center; }

/* INLINE ITEM SEARCH PANEL (replaces modal) */
.inline-item-search-panel {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 16px;
  margin-bottom: 20px;
}
.inline-search-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.inline-search-title { font-size: 15px; font-weight: 700; color: var(--ink); }
.inline-scan-row { margin-bottom: 12px; }
.inline-scan-btn { display: inline-flex; align-items: center; gap: 6px; background: var(--blue-bg); color: var(--blue); border: none; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.modal-search { display: flex; align-items: center; gap: 10px; background: var(--surface); border-radius: var(--r-md); padding: 0 14px; margin: 0 0 12px; border: 1px solid var(--border); }
.modal-search svg { color: var(--ink3); flex-shrink: 0; }
.modal-search-input { flex: 1; border: none; background: transparent; font-size: 15px; color: var(--ink); padding: 12px 0; outline: none; }
.modal-current-item { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--amber-bg); border-radius: var(--r-md); font-size: 13px; }
.modal-current-label { color: var(--amber); font-weight: 600; flex-shrink: 0; }
.modal-current-name { color: var(--ink); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.modal-list { flex: 1; overflow-y: auto; }
.prod-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.prod-row:last-child { border-bottom: none; }
.prod-info { flex: 1; min-width: 0; }
.prod-name { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
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
.fs-qty { font-size: 16px; font-weight: 700; color: var(--green); }
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
</style>