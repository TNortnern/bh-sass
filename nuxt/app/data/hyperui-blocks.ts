/**
 * HyperUI Blocks for GrapesJS
 *
 * Premium Tailwind CSS components organized by category
 * These are production-ready blocks that can be dragged into the canvas
 */

export interface HyperUIBlock {
  id: string
  name: string
  html: string
}

export interface HyperUIType {
  key: string
  label: string
  blocks: HyperUIBlock[]
}

export interface HyperUICategory {
  key: string
  label: string
  description: string
  icon: string
  types: HyperUIType[]
}

const HYPERUI_STRUCTURE: HyperUICategory[] = [
  {
    key: 'marketing',
    label: 'Marketing',
    description: 'Hero sections, CTAs, and promotional components',
    icon: 'megaphone',
    types: [
      {
        key: 'hero',
        label: 'Hero Sections',
        blocks: [
          {
            id: 'hero-centered',
            name: 'Centered Hero',
            html: `
<section class="bg-gray-900 text-white">
  <div class="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
        Understand User Flow.
        <span class="sm:block"> Increase Conversion. </span>
      </h1>
      <p class="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus numquam ea!
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a class="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto" href="#">
          Get Started
        </a>
        <a class="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto" href="#">
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>`
          },
          {
            id: 'hero-split',
            name: 'Split Hero with Image',
            html: `
<section class="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
  <div class="p-8 md:p-12 lg:px-16 lg:py-24">
    <div class="mx-auto max-w-xl text-center sm:text-left">
      <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit
      </h2>
      <p class="hidden text-gray-500 md:mt-4 md:block">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam sed. Quam a scelerisque amet ullamcorper eu enim et fermentum.
      </p>
      <div class="mt-4 md:mt-8">
        <a href="#" class="inline-block rounded bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring focus:ring-yellow-400">
          Get Started Today
        </a>
      </div>
    </div>
  </div>
  <img alt="" src="https://images.unsplash.com/photo-1464582883107-8adf2dca8a9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" class="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]" />
</section>`
          },
          {
            id: 'hero-gradient',
            name: 'Gradient Hero',
            html: `
<section class="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
  <div class="absolute inset-0 bg-black/25"></div>
  <div class="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
    <div class="max-w-xl text-center sm:text-left">
      <h1 class="text-3xl font-extrabold sm:text-5xl">
        Let us find your
        <strong class="block font-extrabold text-yellow-300"> Forever Home. </strong>
      </h1>
      <p class="mt-4 max-w-lg sm:text-xl/relaxed">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus.
      </p>
      <div class="mt-8 flex flex-wrap gap-4 text-center">
        <a href="#" class="block w-full rounded bg-yellow-400 px-12 py-3 text-sm font-medium text-gray-900 shadow hover:bg-yellow-500 focus:outline-none focus:ring active:bg-yellow-600 sm:w-auto">
          Get Started
        </a>
        <a href="#" class="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-purple-600 shadow hover:text-purple-700 focus:outline-none focus:ring active:text-purple-500 sm:w-auto">
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>`
          }
        ]
      },
      {
        key: 'cta',
        label: 'Call to Action',
        blocks: [
          {
            id: 'cta-banner',
            name: 'CTA Banner',
            html: `
<section class="bg-gray-50">
  <div class="p-8 md:p-12 lg:px-16 lg:py-24">
    <div class="mx-auto max-w-lg text-center">
      <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit
      </h2>
      <p class="hidden text-gray-500 sm:mt-4 sm:block">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam sed.
      </p>
    </div>
    <div class="mx-auto mt-8 max-w-xl">
      <form action="#" class="sm:flex sm:gap-4">
        <div class="sm:flex-1">
          <label for="email" class="sr-only">Email</label>
          <input type="email" placeholder="Email address" class="w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition focus:border-white focus:outline-none focus:ring focus:ring-yellow-400" />
        </div>
        <button type="submit" class="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto">
          <span class="text-sm font-medium"> Sign Up </span>
          <svg class="size-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</section>`
          },
          {
            id: 'cta-simple',
            name: 'Simple CTA',
            html: `
<section class="bg-white">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
      <p class="mt-4 text-gray-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae esse non fuga.
      </p>
      <a href="#" class="mt-8 inline-block rounded-full bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-400">
        Get Started Now
      </a>
    </div>
  </div>
</section>`
          }
        ]
      },
      {
        key: 'features',
        label: 'Feature Sections',
        blocks: [
          {
            id: 'features-grid',
            name: 'Features Grid',
            html: `
<section class="bg-white">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-lg text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">Kickstart your marketing</h2>
      <p class="mt-4 text-gray-500">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur aliquam doloribus nesciunt eos fugiat.
      </p>
    </div>
    <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div class="block rounded-xl border border-gray-100 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
        <h2 class="mt-4 text-xl font-bold text-gray-900">Accountant</h2>
        <p class="mt-1 text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci.
        </p>
      </div>
      <div class="block rounded-xl border border-gray-100 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
        <h2 class="mt-4 text-xl font-bold text-gray-900">Lawyer</h2>
        <p class="mt-1 text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci.
        </p>
      </div>
      <div class="block rounded-xl border border-gray-100 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
        <h2 class="mt-4 text-xl font-bold text-gray-900">Designer</h2>
        <p class="mt-1 text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci.
        </p>
      </div>
    </div>
  </div>
</section>`
          }
        ]
      },
      {
        key: 'testimonials',
        label: 'Testimonials',
        blocks: [
          {
            id: 'testimonial-card',
            name: 'Testimonial Card',
            html: `
<section class="bg-gray-50">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-xl text-center">
      <blockquote class="sm:col-span-2">
        <div class="flex justify-center gap-0.5 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
        <p class="mt-4 text-lg font-medium text-gray-900 sm:text-xl">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut."
        </p>
        <cite class="mt-4 inline-flex items-center not-italic">
          <span class="hidden h-px w-6 bg-gray-400 sm:inline-block"></span>
          <p class="text-sm uppercase text-gray-500 sm:ms-3">
            <strong>Sarah Johnson</strong>, CEO at TechCorp
          </p>
        </cite>
      </blockquote>
    </div>
  </div>
</section>`
          }
        ]
      },
      {
        key: 'pricing',
        label: 'Pricing',
        blocks: [
          {
            id: 'pricing-cards',
            name: 'Pricing Cards',
            html: `
<section class="bg-white">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-lg text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
      <p class="mt-4 text-gray-500">Choose the plan that works best for you</p>
    </div>
    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
      <div class="rounded-2xl border border-indigo-600 p-6 shadow-sm ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-12">
        <div class="text-center">
          <h2 class="text-lg font-medium text-gray-900">Pro <span class="sr-only">Plan</span></h2>
          <p class="mt-2 sm:mt-4">
            <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 30$ </strong>
            <span class="text-sm font-medium text-gray-700">/month</span>
          </p>
        </div>
        <ul class="mt-6 space-y-2">
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> 20 users included </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> 5GB of storage </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Email support </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Help center access </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Phone support </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Community access </span></li>
        </ul>
        <a href="#" class="mt-8 block rounded-full border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500">
          Get Started
        </a>
      </div>
      <div class="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
        <div class="text-center">
          <h2 class="text-lg font-medium text-gray-900">Starter <span class="sr-only">Plan</span></h2>
          <p class="mt-2 sm:mt-4">
            <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 0$ </strong>
            <span class="text-sm font-medium text-gray-700">/month</span>
          </p>
        </div>
        <ul class="mt-6 space-y-2">
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> 10 users included </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> 2GB of storage </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Email support </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Help center access </span></li>
        </ul>
        <a href="#" class="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500">
          Get Started
        </a>
      </div>
      <div class="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
        <div class="text-center">
          <h2 class="text-lg font-medium text-gray-900">Enterprise <span class="sr-only">Plan</span></h2>
          <p class="mt-2 sm:mt-4">
            <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 100$ </strong>
            <span class="text-sm font-medium text-gray-700">/month</span>
          </p>
        </div>
        <ul class="mt-6 space-y-2">
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Unlimited users </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> 50GB of storage </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> Priority support </span></li>
          <li class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-indigo-700"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg><span class="text-gray-700"> SLA guarantee </span></li>
        </ul>
        <a href="#" class="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500">
          Contact Sales
        </a>
      </div>
    </div>
  </div>
</section>`
          }
        ]
      }
    ]
  },
  {
    key: 'application',
    label: 'Application UI',
    description: 'Forms, cards, and application components',
    icon: 'layout',
    types: [
      {
        key: 'forms',
        label: 'Forms',
        blocks: [
          {
            id: 'form-contact',
            name: 'Contact Form',
            html: `
<section class="bg-gray-100">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
      <div class="lg:col-span-2 lg:py-12">
        <p class="max-w-xl text-lg">
          At the same time, the fact that we are wholly owned and totally independent from manufacturer and target, doesn't mean that we don't have favourites.
        </p>
        <div class="mt-8">
          <a href="#" class="text-2xl font-bold text-pink-600"> 0151 475 4450 </a>
          <address class="mt-2 not-italic">282 Kevin Brook, Imogeneborough, CA 58517</address>
        </div>
      </div>
      <div class="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
        <form action="#" class="space-y-4">
          <div>
            <label class="sr-only" for="name">Name</label>
            <input class="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Name" type="text" id="name" />
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="sr-only" for="email">Email</label>
              <input class="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Email address" type="email" id="email" />
            </div>
            <div>
              <label class="sr-only" for="phone">Phone</label>
              <input class="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Phone Number" type="tel" id="phone" />
            </div>
          </div>
          <div>
            <label class="sr-only" for="message">Message</label>
            <textarea class="w-full rounded-lg border-gray-200 p-3 text-sm" placeholder="Message" rows="8" id="message"></textarea>
          </div>
          <div class="mt-4">
            <button type="submit" class="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto">
              Send Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>`
          },
          {
            id: 'form-newsletter',
            name: 'Newsletter Signup',
            html: `
<section class="bg-gray-900 text-white">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-lg text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">Stay in the loop</h2>
      <p class="mt-4 text-gray-300">Get the latest updates and offers delivered to your inbox</p>
    </div>
    <form action="#" class="mx-auto mt-8 max-w-md">
      <div class="flex flex-col gap-4 sm:flex-row">
        <input type="email" placeholder="Enter your email" class="flex-1 rounded-lg border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" />
        <button type="submit" class="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 transition">
          Subscribe
        </button>
      </div>
    </form>
  </div>
</section>`
          }
        ]
      },
      {
        key: 'cards',
        label: 'Cards',
        blocks: [
          {
            id: 'card-product',
            name: 'Product Card',
            html: `
<article class="group relative overflow-hidden rounded-lg shadow transition hover:shadow-lg">
  <img alt="" src="https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-300" />
  <div class="relative bg-gradient-to-t from-gray-900/80 to-gray-900/0 pt-32 sm:pt-48 lg:pt-64">
    <div class="p-4 sm:p-6">
      <time datetime="2022-10-10" class="block text-xs text-white/80"> 10th Oct 2022 </time>
      <a href="#">
        <h3 class="mt-0.5 text-lg text-white">How to position your furniture for maximum effect</h3>
      </a>
      <p class="mt-2 line-clamp-3 text-sm/relaxed text-white/80">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus pariatur animi temporibus nesciunt.
      </p>
    </div>
  </div>
</article>`
          },
          {
            id: 'card-stats',
            name: 'Stats Cards',
            html: `
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
    <span class="rounded-full bg-blue-100 p-3 text-blue-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    </span>
    <div>
      <p class="text-2xl font-medium text-gray-900">1,234</p>
      <p class="text-sm text-gray-500">Total Customers</p>
    </div>
  </div>
  <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
    <span class="rounded-full bg-green-100 p-3 text-green-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </span>
    <div>
      <p class="text-2xl font-medium text-gray-900">$45,678</p>
      <p class="text-sm text-gray-500">Total Revenue</p>
    </div>
  </div>
  <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
    <span class="rounded-full bg-purple-100 p-3 text-purple-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    </span>
    <div>
      <p class="text-2xl font-medium text-gray-900">567</p>
      <p class="text-sm text-gray-500">Total Orders</p>
    </div>
  </div>
  <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
    <span class="rounded-full bg-yellow-100 p-3 text-yellow-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    </span>
    <div>
      <p class="text-2xl font-medium text-gray-900">4.8</p>
      <p class="text-sm text-gray-500">Average Rating</p>
    </div>
  </div>
</div>`
          }
        ]
      }
    ]
  },
  {
    key: 'navigation',
    label: 'Navigation',
    description: 'Headers, footers, and navigation components',
    icon: 'menu',
    types: [
      {
        key: 'headers',
        label: 'Headers',
        blocks: [
          {
            id: 'header-simple',
            name: 'Simple Header',
            html: `
<header class="bg-white">
  <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="md:flex md:items-center md:gap-12">
        <a class="block text-teal-600" href="#">
          <span class="sr-only">Home</span>
          <svg class="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5335 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7633 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6267 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7647H25.78C24.4052 12.7496 23.0619 13.146 21.92 13.9047C21.0076 14.5353 20.2627 15.3812 19.75 16.3647C19.2373 15.3812 18.4924 14.5353 17.58 13.9047C16.4381 13.146 15.0948 12.7496 13.72 12.7647C12.3452 12.7496 11.0019 13.146 9.86 13.9047C8.94759 14.5353 8.20272 15.3812 7.69 16.3647C7.17728 15.3812 6.43241 14.5353 5.52 13.9047C4.37812 13.146 3.03476 12.7496 1.66 12.7647H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 5.8098 18.5379 6.38 19.8047H6.79C7.36018 18.5379 8.26202 17.4489 9.4 16.6547C10.016 16.175 10.7795 15.924 11.56 15.9447H15.78C16.5765 15.9227 17.3555 16.1749 17.98 16.6547C19.1179 17.4489 20.0198 18.5379 20.59 19.8047H21C21.5702 18.5379 22.472 17.4489 23.61 16.6547H23.62Z" fill="currentColor"/></svg>
        </a>
      </div>
      <div class="hidden md:block">
        <nav aria-label="Global">
          <ul class="flex items-center gap-6 text-sm">
            <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> About </a></li>
            <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Careers </a></li>
            <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> History </a></li>
            <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Services </a></li>
            <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Projects </a></li>
            <li><a class="text-gray-500 transition hover:text-gray-500/75" href="#"> Blog </a></li>
          </ul>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <div class="sm:flex sm:gap-4">
          <a class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow" href="#"> Login </a>
          <div class="hidden sm:flex">
            <a class="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600" href="#"> Register </a>
          </div>
        </div>
        <div class="block md:hidden">
          <button class="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>`
          }
        ]
      },
      {
        key: 'footers',
        label: 'Footers',
        blocks: [
          {
            id: 'footer-columns',
            name: 'Multi-Column Footer',
            html: `
<footer class="bg-gray-100">
  <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="lg:flex lg:items-start lg:gap-8">
      <div class="text-teal-600">
        <svg class="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5335 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7633 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6267 10.9599 3.6343 10.3549 1.61 10.3847H0.41Z" fill="currentColor"/></svg>
      </div>
      <div class="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
        <div class="col-span-2">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Get the latest news!</h2>
            <p class="mt-4 text-gray-500">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div class="col-span-2 lg:col-span-3 lg:flex lg:items-end">
          <form class="w-full">
            <label for="UserEmail" class="sr-only"> Email </label>
            <div class="border border-gray-100 p-2 focus-within:ring sm:flex sm:items-center sm:gap-4">
              <input type="email" id="UserEmail" placeholder="john@rhcp.com" class="w-full border-none focus:border-transparent focus:ring-transparent sm:text-sm" />
              <button class="mt-1 w-full bg-teal-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-none hover:bg-teal-600 sm:mt-0 sm:w-auto sm:shrink-0">
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <p class="font-medium text-gray-900">Services</p>
          <ul class="mt-6 space-y-4 text-sm">
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> 1on1 Coaching </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Company Review </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Accounts Review </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> HR Consulting </a></li>
          </ul>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <p class="font-medium text-gray-900">Company</p>
          <ul class="mt-6 space-y-4 text-sm">
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> About </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Meet the Team </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Accounts Review </a></li>
          </ul>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <p class="font-medium text-gray-900">Helpful Links</p>
          <ul class="mt-6 space-y-4 text-sm">
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Contact </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> FAQs </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Live Chat </a></li>
          </ul>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <p class="font-medium text-gray-900">Legal</p>
          <ul class="mt-6 space-y-4 text-sm">
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Accessibility </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Returns Policy </a></li>
            <li><a href="#" class="text-gray-700 transition hover:opacity-75"> Refund Policy </a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-8 border-t border-gray-100 pt-8">
      <p class="text-xs text-gray-500">&copy; 2024. Company Name. All rights reserved.</p>
    </div>
  </div>
</footer>`
          }
        ]
      }
    ]
  }
]

/**
 * Get the full HyperUI structure
 */
export function getHyperUIStructure(): HyperUICategory[] {
  return HYPERUI_STRUCTURE
}

/**
 * Get all blocks from all categories flattened
 */
export function getAllHyperUIBlocks(): HyperUIBlock[] {
  const blocks: HyperUIBlock[] = []
  for (const category of HYPERUI_STRUCTURE) {
    for (const type of category.types) {
      blocks.push(...type.blocks)
    }
  }
  return blocks
}

/**
 * Get blocks by category key
 */
export function getHyperUIBlocksByCategory(categoryKey: string): HyperUIBlock[] {
  const category = HYPERUI_STRUCTURE.find(c => c.key === categoryKey)
  if (!category) return []

  const blocks: HyperUIBlock[] = []
  for (const type of category.types) {
    blocks.push(...type.blocks)
  }
  return blocks
}

/**
 * Get a specific block by ID
 */
export function getHyperUIBlockById(blockId: string): HyperUIBlock | undefined {
  for (const category of HYPERUI_STRUCTURE) {
    for (const type of category.types) {
      const block = type.blocks.find(b => b.id === blockId)
      if (block) return block
    }
  }
  return undefined
}

export default {
  getHyperUIStructure,
  getAllHyperUIBlocks,
  getHyperUIBlocksByCategory,
  getHyperUIBlockById
}
