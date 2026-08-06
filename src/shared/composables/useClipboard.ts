import { ref } from 'vue';

export function useClipboard(timeout = 2000) {
  const isCopied = ref(false);
  const copiedText = ref<string | null>(null);

  const copy = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      copiedText.value = text;
      isCopied.value = true;

      setTimeout(() => {
        isCopied.value = false;
        copiedText.value = null;
      }, timeout);

      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  };

  return {
    isCopied,
    copiedText,
    copy
  };
}