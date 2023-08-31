"use client";

import {RecoilRoot} from "recoil";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sass/globals.scss';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Web application that contains leetsCode problems and video solutions" />
        <title>LeetsCode</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body>
        <RecoilRoot>
          {children}
          <ToastContainer />
        </RecoilRoot>
      </body>
    </html>
  )
}
