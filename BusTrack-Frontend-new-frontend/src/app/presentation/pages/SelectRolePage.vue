<script setup lang="js">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

const router = useRouter()
const { t } = useI18n()

const goPassenger = () => {
  router.push('/login')
}

const goCompany = () => {
  router.push('/company/login')
}
</script>

<template>
  <div class="select-role-page">
    <div class="lang-wrapper">
      <LanguageSwitcher />
    </div>

    <div class="card">
      <img src="@/assets/logo-bustrack.png" alt="BusTrack" class="logo" />


      <h2 class="title">
        {{ t('selectRole.title') }}
      </h2>

      <button class="btn btn-passenger" @click="goPassenger">
        {{ t('selectRole.passenger') }}
      </button>

      <button class="btn btn-company" @click="goCompany">
        {{ t('selectRole.company') }}
      </button>
    </div>
  </div>
</template>


<style scoped>
.select-role-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c8d852;
  position: relative;
}


.lang-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
}


.card {
  background: #ffffff;
  padding: 3rem 4rem;
  border-radius: 24px;
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  animation: card-pop 0.6s ease-out;
}


.logo {
  width: 220px;
  height: auto;
  border-radius: 18px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
}


.btn {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}


.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.18);
}

.btn-passenger {
  background: #5f8f2a;
  color: #ffffff;
}

.btn-company {
  background: #000000;
  color: #ffffff;
}


@keyframes card-pop {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
