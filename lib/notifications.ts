import { toast } from "sonner"

export const showNotification = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right"
    })
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 6000,
      position: "top-right"
    })
  },

  info: (message: string) => {
    toast.info(message, {
      duration: 4000,
      position: "top-right"
    })
  },

  warning: (message: string) => {
    toast.warning(message, {
      duration: 5000,
      position: "top-right"
    })
  },

  promise: async <T>(
    promise: Promise<T>,
    loading: string,
    success: string,
    error: string
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      position: "top-right"
    })
  }
}