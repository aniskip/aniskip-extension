/**
 * Main function.
 */
((): void => {
  const { currentScript } = document;

  /**
   * Retrieves the property and sets it as the data attribute.
   */
  const setAttribute = (): void => {
    if (!currentScript) {
      return;
    }

    const { property } = currentScript.dataset;

    if (!property) {
      return;
    }

    currentScript.dataset.value = JSON.stringify(
      window[property as keyof Window]
    );
  };

  if (document.readyState === 'complete') {
    setAttribute();

    return;
  }

  const listener = (): void => {
    setAttribute();

    window.removeEventListener('load', listener);
  };

  window.addEventListener('load', listener);
})();
