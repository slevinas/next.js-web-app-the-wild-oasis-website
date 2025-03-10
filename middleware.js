// import { NextResponse } from 'next/server';

// export function middleware(request, next) {
//   console.log('middleware test');
//   // return next(request);
//   console.log(request);

//   return NextResponse.redirect(new URL('/about', request.url).toString());
  
// }

import { auth } from "@/app/_lib/auth";
export const config = {
  matcher: ["/account"],
};

// export const middleware = auth;
export const middleware = (request) => {
  console.log('Middleware running on', request.url);
  return auth(request);
};
