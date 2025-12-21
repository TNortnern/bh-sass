<template>
  <div class="max-w-5xl mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          Custom Roles & Permissions
        </h2>
        <p class="text-sm text-gray-600 dark:text-[#888]">
          Create custom roles with granular permissions for your team
        </p>
      </div>
    </div>

    <!-- Feature Not Available (Free Plan) -->
    <div
      v-if="!hasCustomRolesAccess"
      class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800/30 rounded-2xl overflow-hidden"
    >
      <div class="p-8">
        <div class="flex items-start gap-6">
          <div class="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <UIcon
              name="i-heroicons-lock-closed"
              class="w-8 h-8 text-white"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Custom Roles Available on Pro & Platinum Plans
            </h3>
            <p class="text-gray-600 dark:text-[#888] mb-4 leading-relaxed">
              Unlock advanced team management with custom roles and granular permissions.
              Define exactly what each team member can access and manage.
            </p>

            <!-- Feature List -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                />
                <span class="text-sm text-gray-700 dark:text-[#aaa]">Create unlimited custom roles</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                />
                <span class="text-sm text-gray-700 dark:text-[#aaa]">Granular permission control</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                />
                <span class="text-sm text-gray-700 dark:text-[#aaa]">Role templates for common positions</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                />
                <span class="text-sm text-gray-700 dark:text-[#aaa]">Assign roles to team members</span>
              </div>
            </div>

            <!-- CTA Button -->
            <UButton
              size="lg"
              color="primary"
              icon="i-heroicons-arrow-up-circle"
              class="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold shadow-lg hover:shadow-amber-500/25 transition-all duration-200"
              @click="handleUpgrade"
            >
              Upgrade to Pro Plan
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Coming Soon (Pro/Platinum Plan) -->
    <div
      v-else
      class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden"
    >
      <div class="p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin"
            style="animation-duration: 3s"
          />
        </div>

        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Custom Roles Coming Soon
        </h3>

        <p class="text-gray-600 dark:text-[#888] max-w-2xl mx-auto mb-6 leading-relaxed">
          We're building powerful custom roles and permissions management for your team.
          This feature is currently in development and will be available soon.
        </p>

        <!-- What's Coming -->
        <div class="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl p-6 max-w-3xl mx-auto mb-6">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            What's Coming
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <UIcon
                  name="i-heroicons-user-group"
                  class="w-4 h-4 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Role Management
                </p>
                <p class="text-xs text-gray-500 dark:text-[#666]">
                  Create, edit, and delete custom roles
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <UIcon
                  name="i-heroicons-shield-check"
                  class="w-4 h-4 text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Granular Permissions
                </p>
                <p class="text-xs text-gray-500 dark:text-[#666]">
                  Control access to bookings, inventory, reports
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <UIcon
                  name="i-heroicons-sparkles"
                  class="w-4 h-4 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Role Templates
                </p>
                <p class="text-xs text-gray-500 dark:text-[#666]">
                  Pre-built roles for common positions
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 flex-shrink-0 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <UIcon
                  name="i-heroicons-clipboard-document-list"
                  class="w-4 h-4 text-orange-600 dark:text-orange-400"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Audit Logging
                </p>
                <p class="text-xs text-gray-500 dark:text-[#666]">
                  Track permission changes and access
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          In Development - Stay Tuned
        </div>

        <!-- Temporary Workaround -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-white/[0.06]">
          <p class="text-sm text-gray-500 dark:text-[#666] mb-3">
            In the meantime, manage your team using the standard roles:
          </p>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-user-group"
            @click="navigateToTeam"
          >
            Go to Team Settings
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { tenant } = useTenant()

const hasCustomRolesAccess = computed(() => {
  // Custom roles are available on Pro and Platinum plans
  const plan = tenant.value?.plan
  return plan === 'pro' || plan === 'platinum'
})

function handleUpgrade() {
  // Navigate to billing page to upgrade plan
  router.push('/app/settings/billing')
}

function navigateToTeam() {
  router.push('/app/settings/team')
}
</script>
