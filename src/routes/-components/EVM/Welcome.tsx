import laikaLogo from '/laika-labs.svg'

export function Welcome() {
  return (
    <div className="relative flex size-full flex-col p-10">
      <div className="absolute top-8 left-0 flex h-24 items-center">
        <svg
          width="95"
          height="68"
          viewBox="0 0 95 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rotate-90 place-self-start"
        >
          <path
            d="M0.878888 56.526C0.32851 55.9068 0.384279 54.9587 1.00345 54.4083L11.0935 45.4394C11.7126 44.889 12.6607 44.9448 13.2111 45.564C13.7615 46.1831 13.7057 47.1313 13.0866 47.6816L4.11766 55.654L12.09 64.6229C12.6404 65.2421 12.5847 66.1902 11.9655 66.7406C11.3463 67.2909 10.3982 67.2352 9.84782 66.616L0.878888 56.526ZM94.4271 1.46187C85.7119 28.3905 68.8748 42.7083 51.0199 50.059C33.2324 57.382 14.5035 57.7675 1.91192 57.0269L2.08808 54.032C14.4965 54.7619 32.6994 54.3571 49.8778 47.2849C66.9888 40.2404 83.1517 26.5582 91.5729 0.538116L94.4271 1.46187Z"
            fill="currentColor"
          />
        </svg>
        <div className="flex flex-col self-end">
          <p className="text-lg font-semibold">Click here to start making a request!</p>
          <p>Talk with smart contract now (w/o a single line of code)!</p>
        </div>
      </div>
      <div className="flex size-full flex-col items-center justify-center">
        <img src={laikaLogo} className="h-32 w-32" alt="Laika Labs logo" />
        <p className="text-3xl font-semibold">Laika</p>
        <p className="text-md pt-2 font-light">All your data is saved locally in you browser!</p>
        <p className="mt-4 mb-0 text-sm text-gray-600">Laika 🐶 is 100% Open Source</p>
        <p className="mt-4 text-sm text-gray-600">
          Give us a Star ⭐️ on{' '}
          <a className="underline" href="https://github.com/laika-labs/laika" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  )
}
