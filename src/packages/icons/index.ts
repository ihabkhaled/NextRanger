/**
 * Owner wrapper for the icon vendor (lucide-react). Only named, app-approved
 * icons are exported; raw lucide imports elsewhere are an ESLint boundary
 * violation. Add icons here deliberately — every icon is API surface.
 */

export {
  AlertCircle as AlertIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Check as CheckIcon,
  Globe as GlobeIcon,
  LoaderCircle as LoaderIcon,
  LogIn as LogInIcon,
  Menu as MenuIcon,
  Moon as MoonIcon,
  Newspaper as NewspaperIcon,
  PanelLeft as PanelLeftIcon,
  Settings as SettingsIcon,
  Sun as SunIcon,
  X as CloseIcon,
} from 'lucide-react';

export type { LucideIcon as AppIcon } from 'lucide-react';
