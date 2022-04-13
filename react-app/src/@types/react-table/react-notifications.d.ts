/// <reference types="node" />

declare module "react-notifications" {
  import React from 'react';

  type NotificationEventFunction = (  
    message: string,
    title?: string,
    timeOut?: number,
    callback?: () => any,
    priority?: boolean
  ) => void;

  interface NotificationManager {
    success: NotificationEventFunction;
    error: NotificationEventFunction;
  }

  export const NotificationManager: NotificationManager;

  export const NotificationContainer: React.FC
}