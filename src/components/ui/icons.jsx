import React from 'react';
import * as P from 'pixelarticons/react';

// Iconos pixel (pixelarticons, MIT). Exportados con los nombres que ya usaban
// las vistas (antes lucide-react) para cambiar de set tocando solo este archivo.
// Los bordes van nítidos (crispEdges) para que el píxel no se difumine al escalar.
const px = (Icon) => {
  const Wrapped = ({ className = '', ...props }) => (
    <Icon shapeRendering="crispEdges" focusable="false" className={className} {...props} />
  );
  return Wrapped;
};

export const AlertCircle = px(P.WarningDiamond);
export const ArrowLeft = px(P.ArrowLeft);
export const ArrowRight = px(P.ArrowRight);
export const BarChart3 = px(P.ChartBarBig);
export const Ban = px(P.Cancel);
export const Briefcase = px(P.Briefcase);
export const Calendar = px(P.Calendar);
export const Camera = px(P.Camera);
export const CheckCircle2 = px(P.Check);
export const Compass = px(P.Compass);
export const Edit = px(P.Pencil);
export const Eye = px(P.Eye);
export const Facebook = px(P.Facebook);
export const FileText = px(P.FileText);
export const Footprints = px(P.Backpack);
export const Globe = px(P.Globe);
export const Globe2 = px(P.Globe);
export const Grid = px(P.Grid2x22);
export const GripVertical = px(P.DragAndDrop);
export const HardHat = px(P.Tools);
export const Heart = px(P.Heart);
export const HeartHandshake = px(P.Heart);
export const Home = px(P.Home);
export const Image = px(P.Image);
export const Instagram = px(P.Instagram);
export const Lock = px(P.Lock);
export const LogOut = px(P.Logout);
export const Mail = px(P.Mail);
export const Map = px(P.Map);
export const MapPin = px(P.MapPin);
export const Menu = px(P.Menu);
export const Pencil = px(P.Pencil);
export const Phone = px(P.Phone);
export const Pin = px(P.Bookmark);
export const PinOff = px(P.Cancel);
export const Plane = px(P.Send);
export const PlaneTakeoff = px(P.Send);
export const Plus = px(P.Plus);
export const Save = px(P.Save);
export const Search = px(P.Search);
export const Send = px(P.Send);
export const Settings = px(P.SettingsCog);
export const Share2 = px(P.Share);
export const ShieldCheck = px(P.Shield);
export const Star = px(P.Star);
export const Suitcase = px(P.Suitcase);
export const Target = px(P.Target);
export const Trash2 = px(P.Trash);
export const User = px(P.User);
export const Users = px(P.Users);
export const Close = px(P.Close);
