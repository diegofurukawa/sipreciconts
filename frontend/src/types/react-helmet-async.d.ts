declare module 'react-helmet-async' {
    import * as React from 'react';
    
    export interface HelmetProps {
      children?: React.ReactNode;
      title?: string;
      defer?: boolean;
      encodeSpecialCharacters?: boolean;
      htmlAttributes?: any;
      base?: any;
      meta?: any[];
      link?: any[];
      script?: any[];
      noscript?: any[];
      style?: any[];
      onChangeClientState?: (newState: any, addedTags: any, removedTags: any) => void;
    }
    
    export class Helmet extends React.Component<HelmetProps, any> {
      static renderStatic(): any;
    }
    
    export interface HelmetProviderProps {
      context?: any;
      children: React.ReactNode;
    }
    
    export const HelmetProvider: React.FC<HelmetProviderProps>;
    
    export default Helmet;
  }