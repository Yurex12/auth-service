export interface ParsedSessionInfo {
  browser: string;
  os: string;
  isMobile: boolean;
}

export function parseUserAgent(userAgent?: string | null): ParsedSessionInfo {
  if (!userAgent) {
    return {
      browser: 'Unknown Browser',
      os: 'Unknown Device',
      isMobile: false,
    };
  }

  // OS detection
  let os = 'Unknown OS';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent,
  );

  if (/Windows NT 10.0/i.test(userAgent)) os = 'Windows';
  else if (/Windows NT 6.3/i.test(userAgent)) os = 'Windows 8.1';
  else if (/Windows/i.test(userAgent)) os = 'Windows';
  else if (/iPhone/i.test(userAgent)) os = 'iOS (iPhone)';
  else if (/iPad/i.test(userAgent)) os = 'iPadOS';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'macOS';
  else if (/Android/i.test(userAgent)) os = 'Android';
  else if (/Linux/i.test(userAgent)) os = 'Linux';

  // Browser detection
  let browser = 'Unknown Browser';
  if (/Edg\//i.test(userAgent)) browser = 'Microsoft Edge';
  else if (/OPR\/|Opera\//i.test(userAgent)) browser = 'Opera';
  else if (/Chrome\/|CriOS\//i.test(userAgent)) browser = 'Google Chrome';
  else if (/Firefox\/|FxiOS\//i.test(userAgent)) browser = 'Mozilla Firefox';
  else if (/Safari\//i.test(userAgent)) browser = 'Apple Safari';

  return {
    browser,
    os,
    isMobile,
  };
}
