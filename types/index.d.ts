type FindFromUnion<
  Target extends {},
  KeyProp extends keyof Target,
  Key extends Target[KeyProp]
> = Target extends { [x in KeyProp]: Key } ? Target : never;