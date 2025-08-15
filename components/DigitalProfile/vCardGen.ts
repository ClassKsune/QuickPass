// components/Profile/vCardGen.ts
import VCard from 'vcard-creator';
import { ProfileState } from '@/types/Profile';

export function downloadVCard(profile: ProfileState) {
    const card = new VCard();

    // Name
    card.addName(profile.surname || '', profile.name || '');

    // Company & Position
    if (profile.company) card.addCompany(profile.company);
    if (profile.position) card.addJobtitle(profile.position);

    // Contact
    if (profile.telephone) card.addPhoneNumber(profile.telephone, 'WORK');
    if (profile.email) card.addEmail(profile.email, 'WORK');

    // Address
    if (profile.country || profile.city) {
        card.addAddress(
            undefined, // PO Box
            undefined, // Extended
            '',        // Street
            profile.city || '',
            '',        // Region
            '',        // Postal code
            profile.country || '',
            'WORK'
        );
    }

    // Note
    if (profile.bio) card.addNote(profile.bio);

    // Photo
    if (profile.image) card.addPhoto(profile.image);

    const vcardString = card.toString();
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name || 'contact'}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
}
