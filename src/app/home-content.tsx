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
import { Drama } from "@/types/drama";

export default function HomeContent() {
  const { data: forYou, isLoading: l1, error: e1 } = useForYouDramas();
  const { data: latest, isLoading: l2 } = useLatestDramas();
  const { data: trending, isLoading: l3 } = useTrendingDramas();
  const { data: sulih, isLoading: l4 } = useSearchDramas("sulih");

  // Fungsi untuk memaksa tipe data menjadi Drama agar tidak error saat build
  const normalizeData = (data: any): Drama[] => {
    if (!data) return [];
    // Ambil array dari .data jika ada, jika tidak anggap data itu sendiri array
    const list = Array.isArray(data) ? data : (data.data || []);
    return list as Drama[];
  };

  // Gabungkan semua data
  const allDramas = [
    ...normalizeData(forYou),
    ...normalizeData(latest),
    ...normalizeData(trending),
    ...normalizeData(sulih)
  ];

  // Hapus duplikat berdasarkan bookId
  const combinedDramas = Array.from(
    new Map(
      allDramas
        .filter(item => item && item.bookId)
        .map((item) => [item.bookId, item])
    ).values()
  );

  const isLoading = l1 || l2 || l3 || l4;

  return (
    <main className="min-h-screen">
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

        {/* Sekarang dramas={combinedDramas} tidak akan error lagi */}
        <DramaGrid dramas={combinedDramas} isLoading={isLoading} />
      </div>
    </main>
  );
}
