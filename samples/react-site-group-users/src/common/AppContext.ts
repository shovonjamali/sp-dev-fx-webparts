//import { BaseWebPartContext, WebPartContext } from '@microsoft/sp-webpart-base';
import { IAppContextProps } from './IAppContextProps';
import { createContext } from 'react';

const AppContext = createContext<IAppContextProps>(undefined);

export default AppContext;