/**
 * Formate une chaîne en numéro de sécurité sociale français (format: X XX XX XX XXX XXX XX)
 * @param input Chaîne à formater (peut contenir des chiffres et espaces)
 * @returns Chaîne formatée ou la chaîne originale si invalide
 */
export function SSNPatternApply(input: string): string {
  if (!input) return "";

  // 1. Nettoyage - ne garder que les chiffres
  const digitsOnly = input.replace(/\D/g, "");

  // 2. Vérification longueur (15 chiffres max)
  if (digitsOnly.length > 15) {
    return digitsOnly.slice(0, 15); // Retourne les 15 premiers chiffres
  }

  // 3. Formatage selon le pattern
  const pattern = [1, 2, 2, 2, 3, 3, 2]; // Structure du NIR
  let formatted = "";
  let position = 0;

  pattern.forEach(count => {
    if (position >= digitsOnly.length) return;

    const part = digitsOnly.slice(position, position + count);
    formatted += formatted ? " " + part : part;
    position += count;
  });

  return formatted;
}

/**
 * Checks if a row is eligible for download based on:
 * - Current date being within the TP card validity period
 * - Having at least one valid attestation number
 *
 * @param row - The data row to check eligibility for
 * @returns boolean - True if download is allowed, false otherwise
 */
export function checkDownloadEligibility(row: any): boolean {
  const currentDate = new Date();

  // Validate TP card date range if dates exist
  if (row.debutCarteTp && row.finCarteTp) {
    const startDate = new Date(row.debutCarteTp);
    const endDate = new Date(row.finCarteTp);

    // Return false if current date is outside valid period
    if (currentDate < startDate || currentDate > endDate) {
      row.canDownload = false;
      return false;
    }
  }

  // Check for existence of any valid attestation number
  const hasValidAttestation =
    row.numAttestation ||
    row.numAttestationFuture ||
    row.numAttestationFutureDetenteur ||
    row.numAttestationParticipant ||
    row.numAttestationFutureParticipant;

  // Set and return the download eligibility flag
  row.canDownload = hasValidAttestation;
  return row.canDownload;
}
