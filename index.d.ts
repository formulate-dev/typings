declare namespace Formulate {
  type Headers = {
    [key:string]: string;
  }

  type FetchOptions = {
    method: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE';
    headers: Headers;
    body: string;
    redirect: 'follow' | 'error' | 'manual';
    referrer: string;
    integrity: string;
  }

  type Response = {
    /**
     * The response body, serialized to a string.
     */
    text: string;

    /**
     * Response headers
     */
    headers: Headers;

    /**
     * The URL of the response.
     */
    url: string;

    /**
     * A boolean indicating whether the response was successful (status in the range 200 – 299) or not.
     */
    ok: boolean;

    /**
     * Indicates whether or not the response is the result of a redirect (that is, 
     * its URL list has more than one entry).
     */
    redirected: boolean;

    /**
     * The status code of the response. (This will be 200 for a success).
     */
    status: number;

    /**
     * The status message corresponding to the status code. (e.g., OK for 200).
     */
    statusText: string;

    /**
     * The type of the response (e.g., basic, cors).
     */
    type: string;
  }

  type OneOrMoreChoices<T> = T extends true ? Choice : Choice[];

  type Choice = {
    /**
     * Display name for the choice that the user sees.
     */
    label: string;

    /**
     * Internal value for the choice that your script can use.
     */
    value: string;

    /**
     * URL to an image to display for this choice.
     */
    image: string;
  }

  type PaymentStatus = {
    /**
     * Did this payment succeed?
     */
    status: 'successful' | 'stripe-not-set-up' | 'failed';

    /**
     * Stripe identifier for this payment.
     */
    id: string;

    lineItems: Array<PaymentLineItem>;
  }

  type PaymentLineItem = {
    /**
     * A non-negative integer in cents representing how much to charge.
     */
    amount: number;

    /**
     * The product’s name, meant to be displayable to the customer.
     */
    name: string;

    /**
     * The product’s description, meant to be displayable to the customer. 
     */
    description: string;

    /**
     * The quantity of the line item being purchased
     */
    quantity: string;

    /**
     * A list of up to 8 URLs of images for this product, meant to be displayable to the customer.
     */
    imageUrls: Array<string>;
  }

  type BannerOptions = {
    /**
     * Comma-separated list of tags; matching images from Unsplash are used automatically.
     */
    unsplash: string;

    /**
     * The banner spans the height of the browser window.
     */
    full: string;

    /**
     *  The banner displays the image at this URL.
     */
    imageUrl: string;

    /**
     *  The banner displays the video at this URL.
     */
    videoUrl: string;
  }

  type Options = {
    /**
     * Supplement the question with extra information. Markdown supported.
     */
    description: boolean;

    /**
     * Don't record the answer to this question.
     */
    ignore: boolean;

    /**
     * Display an image, video, or GIF alongside the question.
     */
    banner: BannerOptions;

    /**
     * Override question text when submitted.
     * 
     * Not presented to the user.
     */
    name: string;

    /**
     * Allow this question to be skipped.
     */
    optional: boolean;
  }

  type ShortOptions = Options & {
    /**
     * Only allow answers that are email addresses.
     */
    email: boolean;

    /**
     * Only allow answers that are phone numbers.
     */
    tel: boolean;

    /**
     * Only allow answers that are valid URLs.
     */
    url: boolean;

    /**
     * Prefill the answer with this value.
     */
    value: boolean;
  }

  type LongOptions = Options & {
    /**
     * Prefill the answer with this value.
     */
    value: boolean;
  }

  type RatingOptions = Options & {
    /**
     * The maximum rating / the total number of stars.
     */
    max: boolean;
  }

  type SelectOptions<T> = Options & {
    /**
     * Only allow a single option to be selected.
     */
    single: T;
  }

  type MultiOptions<T> = Options & {
    /**
     * Only allow a single option to be selected.
     */
    single: T;

    /**
     * Don't display numeric shortcuts against each option.
     */
    hideNumbers: boolean;
  }

  type PaymentOptions = Options & {
    /**
     * The currency you want to accept this payment in.
     * 
     * This must be a supported three-letter code from https://stripe.com/docs/currencies
     */
    currency: string;

    /**
     * A list of the items you're requesting a payment for.
     */
    items: Array<PaymentLineItem>;
  }


  /**
   *  This is you primary interface to the outside world. 
   *  Display questions, fetch data, or log data to the browser console.
   */
  interface Context {
    /**
     *  Collect a short answer that fits on a single line.
     * 
     *  @param {string} question The prompt or question that the user sees.
     *  @param {ShortOptions} options Options to modify this question's behavior.
     */
    short(question: string, options: ShortOptions): Promise<string>

    /**
     *  Collect a long answer across multiple lines.
     * 
     *  @param {string} question The prompt or question that the user sees.
     *  @param {LongOptions} options Options to modify this question's behavior.
     */
    long(question: string, options: ShortOptions): Promise<string>

    /**
     *  Collect a star rating
     * 
     *  @param {string} question The prompt or question that the user sees.
     *  @param {RatingOptions} options Options to modify this question's behavior.
     */
    rating(question: string, options: RatingOptions): Promise<string>

    /**
     *  Collect a choice from a large number of options, presented as a dropdown.
     * 
     *  @param {string} question The prompt or question that the user sees.
     *  @param {Array<string|Choice>} choices A list of choices to pick from.
     *  @param {SelectOptions} options Options to modify this question's behavior.
     */
    select<T extends boolean>(question: string, choices: Array<string | Choice>, options: SelectOptions<T>): Promise<OneOrMoreChoices<T>>

    /**
     *  Collect a choice from a small number of options, with all options visible at once.
     * 
     *  @param {string} question The prompt or question that the user sees.
     *  @param {Array<string|Choice>} choices A list of choices to pick from.
     *  @param {MultiOptions} options Options to modify this question's behavior.
     */
    multi<T extends boolean>(question: string, choices: Array<string | Choice>, options: MultiOptions<T>): Promise<OneOrMoreChoices<T>>

    /**
     *  Collect a payment from the user.
     * 
     *  @param {string} question The prompt or question that the user sees.
     *  @param {PaymentOptions} options Options to configure the payment you're going to accept.
     */
    payment(question: string, options: PaymentOptions): Promise<PaymentStatus>

    /**
     *  Record a response without user interaction.
     * 
     *  @param {string} question The question to be recorded.
     *  @param {string} answer The answer to be recorded against the question.
     *  @param {Options} options Options to modify this question's behavior.
     */
    hidden(question: string, answer: string, options: Options): Promise<string>

    /**
     *  Display a statement without requiring a response.
     * 
     *  @param {string} question The statement to be shown to the user.
     *  @param {Options} options Options to modify the statement's behavior.
     */
    statement(statement: string, options: Options): Promise<null>

    /**
     *  Display a statement without requiring a response.
     * 
     *  @param {string} resource The URL to fetch.
     *  @param {FetchOptions} options Modify the request you're sending out.
     */
    fetch(resource: string, options: FetchOptions): Promise<Response>

    /**
     *  Log to the browser console.
     * 
     *  Passed arguments are piped through `JSON.stringify`.
     */
    log(...args: any): null

    /**
     *  Log error to the browser console.
     * 
     *  Passed arguments are piped through `JSON.stringify`.
     */
    error(...args: any): null

    /**
     *  Format data (typically the answer from a previous question) for use in a question.
     * 
     *  This will also replace the passed value with underscores (______) in the actual submission.
     */
    interpolate(answer: any): string

    /**
     *  Format data (typically the answer from a previous question) for use in a question.
     * 
     *  This will also replace the passed value with underscores (______) in the actual submission.
     * 
     *  Shorthand for `interpolate()`
     */
    interp(answer: any): string

    /**
     *  Format data (typically the answer from a previous question) for use in a question.
     * 
     *  This will also replace the passed value with underscores (______) in the actual submission.
     * 
     *  Shorthand for `interpolate()`
     */
    i(answer: any): string

    /**
     * Retrieve a value from the browser URL query string.
     */
    param(key: string): string | null;
  }
}

declare global {
  const f: Formulate.Context;
  const form: Formulate.Context;
  const formulate: Formulate.Context;
}

export {}