import LegalDocument from '../components/ui/LegalDocument';
import { TERMINOS } from '../legal/terminos';

const Terminos = () => <LegalDocument doc={TERMINOS} other={{ to: '/privacidad', label: 'Política de Privacidad' }} />;

export default Terminos;
