self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/:path*"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()