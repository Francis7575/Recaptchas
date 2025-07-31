export type FormProps = {
  name: string;
  email: string;
  password: string;
}

// Declare 'turnstile' on the Window interface
// declare global {
//   interface Window {
//     turnstile: {
//       render: (
//         container: HTMLElement,
//         options: {
//           sitekey: string;
//           theme?: string;
//           callback?: (token: string) => void;
//           'error-callback'?: () => void;
//         }
//       ) => void;
//       ready: (callback: () => void) => void;
//     };
//   }
// }