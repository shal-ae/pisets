export class ValidateUtils {
  static validateEmail( email: string ): string | null {
    if (
      email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      return null
    }
    return 'Неверный email'
  }

  static validatePassword( password: string ): string | null {
    if ( password?.length < 6 ) {
      return 'Минимальная длина пароля 6 символов'
    }
    return null
  }
}
