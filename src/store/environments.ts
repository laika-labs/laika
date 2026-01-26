import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EnvironmentVariable {
  id: string
  key: string
  value: string
}

export interface Environment {
  id: string
  name: string
  variables: EnvironmentVariable[]
}

export interface EnvironmentStore {
  globalEnvironment: Environment
  environments: Environment[]
  activeEnvironmentId: string | null
  addEnvironment: (name?: string) => string
  removeEnvironment: (id: string) => void
  renameEnvironment: (id: string, name: string) => void
  setActiveEnvironment: (id: string | null) => void
  addVariable: (environmentId: string, key: string, value: string) => string
  updateVariable: (environmentId: string, variableId: string, key: string, value: string) => void
  removeVariable: (environmentId: string, variableId: string) => void
  addGlobalVariable: (key: string, value: string) => string
  updateGlobalVariable: (variableId: string, key: string, value: string) => void
  removeGlobalVariable: (variableId: string) => void
  getActiveEnvironment: () => Environment | null
  getVariableValue: (key: string) => string | null
}

const createGlobalEnvironment = (): Environment => ({
  id: uuidv4(),
  name: 'Global',
  variables: [],
})

export const useEnvironmentStore = create<EnvironmentStore>()(
  persist(
    (set, get) => ({
      globalEnvironment: createGlobalEnvironment(),
      environments: [],
      activeEnvironmentId: null,
      addEnvironment: (name) => {
        const id = uuidv4()
        const environment: Environment = {
          id,
          name: name ?? 'New Environment',
          variables: [],
        }
        set((state) => ({
          environments: [...state.environments, environment],
        }))
        return id
      },
      removeEnvironment: (id: string) =>
        set((state) => {
          const environments = state.environments.filter((env) => env.id !== id)
          const activeEnvironmentId =
            state.activeEnvironmentId === id
              ? environments.length > 0
                ? environments[0].id
                : null
              : state.activeEnvironmentId
          return {
            environments,
            activeEnvironmentId,
          }
        }),
      renameEnvironment: (id: string, name: string) =>
        set((state) => ({
          environments: state.environments.map((env) => (env.id === id ? { ...env, name } : env)),
        })),
      setActiveEnvironment: (id: string | null) =>
        set({
          activeEnvironmentId: id,
        }),
      addVariable: (environmentId: string, key: string, value: string) => {
        const variableId = uuidv4()
        set((state) => ({
          environments: state.environments.map((env) =>
            env.id === environmentId
              ? {
                  ...env,
                  variables: [...env.variables, { id: variableId, key, value }],
                }
              : env,
          ),
        }))
        return variableId
      },
      updateVariable: (environmentId: string, variableId: string, key: string, value: string) =>
        set((state) => ({
          environments: state.environments.map((env) =>
            env.id === environmentId
              ? {
                  ...env,
                  variables: env.variables.map((v) => (v.id === variableId ? { ...v, key, value } : v)),
                }
              : env,
          ),
        })),
      removeVariable: (environmentId: string, variableId: string) =>
        set((state) => ({
          environments: state.environments.map((env) =>
            env.id === environmentId
              ? {
                  ...env,
                  variables: env.variables.filter((v) => v.id !== variableId),
                }
              : env,
          ),
        })),
      addGlobalVariable: (key: string, value: string) => {
        const variableId = uuidv4()
        set((state) => ({
          globalEnvironment: {
            ...state.globalEnvironment,
            variables: [...state.globalEnvironment.variables, { id: variableId, key, value }],
          },
        }))
        return variableId
      },
      updateGlobalVariable: (variableId: string, key: string, value: string) =>
        set((state) => ({
          globalEnvironment: {
            ...state.globalEnvironment,
            variables: state.globalEnvironment.variables.map((v) => (v.id === variableId ? { ...v, key, value } : v)),
          },
        })),
      removeGlobalVariable: (variableId: string) =>
        set((state) => ({
          globalEnvironment: {
            ...state.globalEnvironment,
            variables: state.globalEnvironment.variables.filter((v) => v.id !== variableId),
          },
        })),
      getActiveEnvironment: () => {
        const state = get()
        if (!state.activeEnvironmentId) {
          return null
        }
        return state.environments.find((env) => env.id === state.activeEnvironmentId) ?? null
      },
      getVariableValue: (key: string) => {
        const state = get()

        if (state.activeEnvironmentId) {
          const activeEnvironment = state.environments.find((env) => env.id === state.activeEnvironmentId)
          if (activeEnvironment) {
            const variable = activeEnvironment.variables.find((v) => v.key === key)
            if (variable) {
              return variable.value
            }
          }
        }

        const variable = state.globalEnvironment.variables.find((v) => v.key === key)
        if (variable) {
          return variable.value
        }

        return null
      },
    }),
    {
      name: 'evmEnvironments',
    },
  ),
)
