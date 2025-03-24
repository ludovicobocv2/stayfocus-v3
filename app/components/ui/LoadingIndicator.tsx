'use client'

type LoadingIndicatorProps = {
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
  text?: string
}

export function LoadingIndicator({
  size = 'medium',
  fullScreen = false,
  text = 'Carregando...'
}: LoadingIndicatorProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3'
  }

  // Se for fullScreen, cobrir toda a tela com um overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400`}></div>
          {text && <p className="text-gray-700 dark:text-gray-300 font-medium">{text}</p>}
        </div>
      </div>
    )
  }

  // Versão inline
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400`}></div>
      {text && <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>}
    </div>
  )
} 