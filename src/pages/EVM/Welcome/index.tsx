import { useTheme } from '@/components/ThemeProvider'
import Details from './Details'

const Welcome = () => {
  const { theme } = useTheme()

  return (
    <div className="flex flex-col w-full h-full p-10">
      <div className="absolute left-10 flex flex-col items-center">
        <p className="text-lg font-semibold">Click here to start making a request!</p>
        <p>Talk with smart contract now (w/o a single line of code)!</p>
        <svg
          width="95"
          height="68"
          viewBox="0 0 95 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-4 -ml-16"
        >
          <path
            d="M0.878888 56.526C0.32851 55.9068 0.384279 54.9587 1.00345 54.4083L11.0935 45.4394C11.7126 44.889 12.6607 44.9448 13.2111 45.564C13.7615 46.1831 13.7057 47.1313 13.0866 47.6816L4.11766 55.654L12.09 64.6229C12.6404 65.2421 12.5847 66.1902 11.9655 66.7406C11.3463 67.2909 10.3982 67.2352 9.84782 66.616L0.878888 56.526ZM94.4271 1.46187C85.7119 28.3905 68.8748 42.7083 51.0199 50.059C33.2324 57.382 14.5035 57.7675 1.91192 57.0269L2.08808 54.032C14.4965 54.7619 32.6994 54.3571 49.8778 47.2849C66.9888 40.2404 83.1517 26.5582 91.5729 0.538116L94.4271 1.46187Z"
            fill={theme === 'light' ? 'black' : 'white'}
          />
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Details />
      </div>
    </div>
  )
}

export default Welcome
