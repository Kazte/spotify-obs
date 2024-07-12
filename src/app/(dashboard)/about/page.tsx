import { Button } from '@/components/ui/button';
import Code from '@/components/code';

export default function AboutPage() {
  return (
    <div className='container mx-auto flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>About</h1>
      <p>
        This is a Spotify overlay for OBS. It allows you to display the current
        song playing on Spotify in your OBS stream.
      </p>

      <section className='flex flex-col gap-4 border-b border-container1 my-4 pb-4'>
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
            Set the width between{' '}
            <span className='font-semibold'>250 - 550</span> pixels and the
            height to <span className='font-semibold'>92</span> pixels.
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
      </section>

      <section className='flex flex-col gap-4 my-4 pb-4'>
        <h2>How to create a theme</h2>

        <p>
          You can customize the overlay by creating a theme. A theme is a JSON
          file that contains the colors of the overlay. You can create a theme
          using the following json schema:
        </p>

        <Code
          code={`{
  name: string,
  text_color: string,
  background_color: string,
  border_color: string
}`}
        />

        <p>Example:</p>
        <Code
          code={`{
  "name": "My Theme",
  "text_color": "#ffffff",
  "background_color": "#000000",
  "border_color": "#ffffff"
}`}
        />

        <p>
          You can create a theme by creating a JSON file in a {` `}
          <Button variant='link' asChild className='p-0'>
            <a href='https://gist.github.com/' target='_blank' rel='noreferrer'>
              Gist
            </a>
          </Button>
          . Once you have created the theme, you can use the raw URL of the Gist
          to set the theme in the dashboard.
        </p>
      </section>
    </div>
  );
}
