export default function AboutPage() {
  return (
    <div className='container mx-auto p-4 flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>About</h1>

      <p>
        This is a Spotify overlay for OBS. It allows you to display the current
        song playing on Spotify in your OBS stream.
      </p>

      <h2>How to use</h2>

      <p>
        To use this overlay, you need to have OBS installed on your computer.
        You will also need to have a Spotify account.
      </p>

      <ul className='list-disc list-inside'>
        <li>
          <strong>Step 1:</strong> Open OBS and create a new browser source.
        </li>

        <li>
          <strong>Step 2:</strong> Copy the URL of the overlay from the
          dashboard. There is a green button that says &quot;Copy to
          Clipboard&quot;. Click on it.
        </li>

        <li>
          <strong>Step 3:</strong> Paste the URL into the OBS browser source.
          Set the width between <span className='font-semibold'>250 - 550</span>{' '}
          pixels and the height to <span className='font-semibold'>92</span>{' '}
          pixels.
        </li>

        <li>
          <strong>Step 4:</strong> Click on &quot;OK&quot; to save the browser
          source.
        </li>

        <li>
          <strong>Step 5:</strong> You should now see the overlay in your OBS
          stream.
        </li>
      </ul>
    </div>
  );
}
