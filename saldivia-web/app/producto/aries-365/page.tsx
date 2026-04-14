import { getAries305GalleryPaths } from "@/lib/aries-305-gallery";
import Aries365Client from "./Aries365Client";

export default function Aries365Page() {
  const galleryImages = getAries305GalleryPaths();
  return <Aries365Client galleryImages={galleryImages} />;
}
