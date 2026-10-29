import React, { ViewTransition } from 'react'

/**
 * Every page's content lifts in on navigation: the old page fades out quickly,
 * the new one fades in while rising a few pixels. The `page-enter` and
 * `page-exit` classes are styled in globals.css.
 *
 * Wrap a page's whole content in this. Give it a `key` where the route is
 * dynamic, so that going from one slug to another counts as one page leaving
 * and another arriving rather than an update of the same page — updates are
 * deliberately not animated (`default="none"`), so that unrelated transitions
 * like a Suspense reveal do not also replay the page animation.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ViewTransition enter="page-enter" exit="page-exit" default="none">
    {children}
  </ViewTransition>
)
