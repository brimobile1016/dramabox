/* "use client";

import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useForYouDramas } from "@/hooks/useDramas";

export default function HomeContent() {
  const { data: dramas, isLoading, error } = useForYouDramas();

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Untuk Kamu"
        description="Drama pilihan yang dipersonalisasi khusus untukmu. Temukan cerita seru yang sesuai selera!"
        icon="sparkles"
      />

      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Gagal memuat drama. Silakan coba lagi.</p>
          </div>
        )}

        <DramaGrid dramas={dramas} isLoading={isLoading} />
      </div>
    </main>
  );
}
*/

"use client";

import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { 
  useForYouDramas, 
  useLatestDramas, 
  useTrendingDramas, 
  useSearchDramas 
} from "@/hooks/useDramas";

export default function HomeContent() {
  // Ambil semua kategori data
  const { data: forYou, isLoading: l1, error: e1 } = useForYouDramas();
  const { data: latest, isLoading: l2 } = useLatestDramas();
  const { data: trending, isLoading: l3 } = useTrendingDramas();
  const { data: sulih, isLoading: l4 } = useSearchDramas("sulih");

  // Gabungkan semua data menjadi satu daftar panjang tanpa section tambahan
  const allDramas = [
    ...(forYou || []),
    ...(latest || []),
    ...(trending || []),
    ...(sulih || [])
  ];

  // Hapus duplikat agar tidak ada video yang muncul 2 kali
  const combinedDramas = Array.from(
    new Map(allDramas.map((item) => [item.bookId, item])).values()
  );

  const isLoading = l1 || l2 || l3 || l4;

  return (
    <main className="min-h-screen">
      {/* Bagian ini tetap sama sesuai permintaanmu */}
      <HeroSection
        title="Untuk Kamu"
        description="Drama pilihan yang dipersonalisasi khusus untukmu. Temukan cerita seru yang sesuai selera!"
        icon="sparkles"
      />

      <div className="container mx-auto px-4 pb-12">
        {e1 && (
          <div className="text-center py-12">
            <p className="text-destructive">Gagal memuat drama. Silakan coba lagi.</p>
          </div>
        )}

        {/* DramaGrid sekarang berisi gabungan semua kategori secara otomatis */}
        <DramaGrid dramas={combinedDramas} isLoading={isLoading} />
      </div>
    </main>
  );
}
