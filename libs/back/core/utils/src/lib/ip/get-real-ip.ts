const HEADER_FIELD_REAL_IP = 'x-real-ip'
const HEADER_FIELD_X_FORWARDED_FOR = 'x-forwarded-for'

export interface RealIpInfo {
  ip: string;
  public: boolean;
  info: {
    directIp: string;
    xRealIp: string;
    xForwardedFor: string;
  };
  request: {
    headers: any;
  };
}

export function getRealIp( req: Request, directIp: string ): RealIpInfo {
  const res: RealIpInfo = {
    ip: '',
    public: false,
    info: {
      directIp,
      xRealIp: req.headers[ HEADER_FIELD_REAL_IP ] || '',
      xForwardedFor: req.headers[ HEADER_FIELD_X_FORWARDED_FOR ] || '',
    },
    request: {
      headers: req.headers,
    },
  }
  if ( isValidPublicIp( directIp ) ) {
    res.ip = directIp
  }
  if ( isValidPublicIp( res.info.xRealIp ) ) {
    res.ip = res.info.xRealIp
  }
  if ( isValidPublicIp( res.info.xForwardedFor ) ) {
    res.ip = res.info.xForwardedFor
  }
  res.public = isValidPublicIp( res.ip )
  return res
}

export function isValidPublicIp( ip: string ): boolean {
  if ( !ip ) {
    return false
  }
  if (
    ip.startsWith( '192.168.' ) ||
    ip.startsWith( '::ffff:192.168.' ) ||
    ip === '::1'
  ) {
    return false
  }
  return true
}
