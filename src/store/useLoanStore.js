import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const DRAFT_KEY = 'lendswift_draft_v1';

/**
 * Fields that are safe to keep in plain localStorage today.
 *
 * Step 1 collects no personally identifiable information, so a plain draft is
 * fine. From Step 2 onwards the draft carries PAN, Aadhaar, income and address,
 * and the brief requires AES-256-GCM via the Web Crypto API - that lands with
 * the auto-save milestone, which replaces this storage adapter. Until then the
 * allowlist below guarantees no PII can reach disk by accident.
 */
const PERSISTED_FIELDS = ['loanType', 'loanAmount', 'loanTenure', 'loanPurpose', 'referralCode'];

const pickPersistable = (formData) =>
  Object.fromEntries(Object.entries(formData).filter(([key]) => PERSISTED_FIELDS.includes(key)));

export const useLoanStore = create()(
  persist(
    (set) => ({
      formData: {},
      currentStepId: 'loanType',
      completedStepIds: [],
      lastSavedAt: null,

      setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

      markStepComplete: (stepId) =>
        set((state) => ({
          completedStepIds: state.completedStepIds.includes(stepId)
            ? state.completedStepIds
            : [...state.completedStepIds, stepId],
        })),

      goToStep: (stepId) => set({ currentStepId: stepId }),

      touchSavedAt: () => set({ lastSavedAt: new Date().toISOString() }),

      reset: () =>
        set({
          formData: {},
          currentStepId: 'loanType',
          completedStepIds: [],
          lastSavedAt: null,
        }),
    }),
    {
      name: DRAFT_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: pickPersistable(state.formData),
        currentStepId: state.currentStepId,
        completedStepIds: state.completedStepIds,
        lastSavedAt: state.lastSavedAt,
      }),
    },
  ),
);
