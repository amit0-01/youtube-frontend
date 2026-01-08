declare namespace JSX {
    interface IntrinsicElements {
      'youtube-video': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        controls?: boolean;
      };
    }
  }