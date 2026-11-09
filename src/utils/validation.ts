export function isValidGitHubUrl(input: string) {
  try {
    const url = new URL(input);
    return url.hostname === 'github.com' || url.hostname.endsWith('.github.com');
  } catch {
    return false;
  }
}
