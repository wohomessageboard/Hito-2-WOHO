import LegalDocument from '../components/ui/LegalDocument';
import { PRIVACIDAD } from '../legal/privacidad';

const Privacidad = () => <LegalDocument doc={PRIVACIDAD} other={{ to: '/terminos', label: 'Términos y Condiciones' }} />;

export default Privacidad;
