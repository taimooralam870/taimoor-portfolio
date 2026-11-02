export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("toast", { detail: message }));
}

export async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    toast("Email copied to clipboard ✦");
  } catch {
    window.location.href = `mailto:${email}`;
  }
}
