import React, { useState } from 'react';
import { ChemicalItem, UserRole } from '../types/lims';
import { 
  FlaskConical, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Check,
  PackagePlus
} from 'lucide-react';

interface ChemicalInventoryTabProps {
  currentRole: UserRole;
  chemicals: ChemicalItem[];
  onUpdateChemical: (chemical: ChemicalItem) => void;
  onAddChemical: (chemical: ChemicalItem) => void;
  onDeleteChemical: (id: string) => void;
  onOpenQuickModal?: (chemical?: ChemicalItem) => void;
}

export const ChemicalInventoryTab: React.FC<ChemicalInventoryTabProps> = ({
  currentRole,
  chemicals,
  onUpdateChemical,
  onAddChemical,
  onDeleteChemical,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Habis' | 'Rendah' | 'PelarutRutin' | 'PelarutKhas'>('All');
  const [editingChemical, setEditingChemical] = useState<ChemicalItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [chemicalFormula, setChemicalFormula] = useState('');
  const [purpose, setPurpose] = useState('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [unit, setUnit] = useState('Liter');
  const [minThreshold, setMinThreshold] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSolvent, setIsSolvent] = useState(false);
  const [usageFrequency, setUsageFrequency] = useState<'rutin' | 'bukan_selalu'>('rutin');
  const [storageLocation, setStorageLocation] = useState('');

  const openEditModal = (chem: ChemicalItem) => {
    setEditingChemical(chem);
    setName(chem.name);
    setChemicalFormula(chem.chemicalFormula);
    setPurpose(chem.purpose);
    setCurrentStock(chem.currentStock);
    setUnit(chem.unit);
    setMinThreshold(chem.minThreshold);
    setNotes(chem.notes || '');
    setIsSolvent(chem.isSolvent || false);
    setUsageFrequency(chem.usageFrequency || 'rutin');
    setStorageLocation(chem.storageLocation || '');
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingChemical(null);
    setName('');
    setChemicalFormula('');
    setPurpose('');
    setCurrentStock(2.0);
    setUnit('Liter');
    setMinThreshold(1.0);
    setNotes('');
    setIsSolvent(true);
    setUsageFrequency('bukan_selalu');
    setStorageLocation('Kabinet Pelarut Khas (Flammable B)');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBy = currentRole === 'boss' ? 'Dr. Farhan Ismail (Boss)' : 'Aiman Azaly (Staff)';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let calculatedStatus: 'Tersedia' | 'Rendah' | 'Habis' = 'Tersedia';
    if (currentStock <= 0) {
      calculatedStatus = 'Habis';
    } else if (currentStock <= minThreshold) {
      calculatedStatus = 'Rendah';
    } else {
      calculatedStatus = 'Tersedia';
    }

    if (editingChemical) {
      onUpdateChemical({
        ...editingChemical,
        name,
        chemicalFormula,
        purpose,
        currentStock,
        unit,
        minThreshold,
        status: calculatedStatus,
        notes,
        isSolvent,
        usageFrequency,
        storageLocation,
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: now,
      });
    } else {
      const newChem: ChemicalItem = {
        id: `chem-${Date.now()}`,
        name,
        chemicalFormula,
        purpose,
        currentStock,
        unit,
        minThreshold,
        status: calculatedStatus,
        notes,
        isSolvent,
        usageFrequency,
        storageLocation,
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: now,
      };
      onAddChemical(newChem);
    }
    setIsModalOpen(false);
  };

  const handleQuickStatusChange = (chem: ChemicalItem, newStatus: 'Habis' | 'Tersedia') => {
    const updatedBy = currentRole === 'boss' ? 'Dr. Farhan Ismail (Boss)' : 'Aiman Azaly (Staff)';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let updatedStock = chem.currentStock;
    let newNotes = chem.notes || '';

    if (newStatus === 'Habis') {
      updatedStock = 0;
      newNotes = `Bahan dilaporkan habis oleh ${updatedBy}. Perlu pesanan segera.`;
    } else {
      updatedStock = chem.minThreshold * 2;
      newNotes = `Stok dibekalkan semula (${updatedStock} ${chem.unit}).`;
    }

    onUpdateChemical({
      ...chem,
      status: newStatus,
      currentStock: updatedStock,
      notes: newNotes,
      lastUpdatedBy: updatedBy,
      lastUpdatedAt: now,
    });
  };

  const filteredChemicals = chemicals.filter((chem) => {
    const matchesSearch =
      chem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chem.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chem.chemicalFormula.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'Habis') return chem.status === 'Habis';
    if (filterType === 'Rendah') return chem.status === 'Rendah';
    if (filterType === 'PelarutRutin') return chem.isSolvent && chem.usageFrequency === 'rutin';
    if (filterType === 'PelarutKhas') return chem.isSolvent && chem.usageFrequency === 'bukan_selalu';

    return true;
  });

  const outOfStockCount = chemicals.filter((c) => c.status === 'Habis').length;
  const nonRoutineSolventsCount = chemicals.filter((c) => c.isSolvent && c.usageFrequency === 'bukan_selalu').length;

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Inventori Reagen & Pelarut (Solvent) Makmal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau bekalan pelarut rutin dan solvent bukan rutin (bukan selalu pakai: THF, Kloroform, Sikloheksana, MEK) untuk pengujian getah.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Reagen / Pelarut Khas</span>
        </button>
      </div>

      {/* Critical Stock Alert Banner */}
      {outOfStockCount > 0 && (
        <div className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-lg flex items-center gap-3 text-xs text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <strong>Perhatian:</strong> {outOfStockCount} bahan kimia makmal sedang berstatus <strong>HABIS</strong>. Ujian fizikal yang bergantung kepada bahan ini akan tergendala.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pelarut (THF, Kloroform, Toluene), formula, atau ujian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 text-xs text-white rounded-md border border-slate-700/80 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>

        {/* Classification Segmented Control */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setFilterType('All')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterType === 'All' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({chemicals.length})
          </button>
          <button
            onClick={() => setFilterType('PelarutKhas')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterType === 'PelarutKhas'
                ? 'bg-amber-950 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pelarut khas R&D yang bukan selalu pakai"
          >
            ★ Pelarut Bukan Selalu Pakai ({nonRoutineSolventsCount})
          </button>
          <button
            onClick={() => setFilterType('PelarutRutin')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterType === 'PelarutRutin' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pelarut Rutin
          </button>
          <button
            onClick={() => setFilterType('Habis')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterType === 'Habis' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Habis ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Chemical Inventory Table */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-[#0b101b] text-slate-400 text-[11px] font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Bahan / Pelarut</th>
                <th className="px-4 py-3 font-semibold">Jenis Penggunaan & Lokasi</th>
                <th className="px-4 py-3 font-semibold">Tujuan Pengujian</th>
                <th className="px-4 py-3 font-semibold">Baki Semasa / Ambang</th>
                <th className="px-4 py-3 font-semibold">Status Ketersediaan</th>
                <th className="px-4 py-3 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredChemicals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tiada bahan kimia dijumpai mengikut tapisan semasa.
                  </td>
                </tr>
              ) : (
                filteredChemicals.map((chem) => (
                  <tr
                    key={chem.id}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    {/* Name & Formula */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {chem.isSolvent && <FlaskConical className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        <span>{chem.name}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        {chem.chemicalFormula}
                      </div>
                    </td>

                    {/* Frequency & Storage */}
                    <td className="px-4 py-3">
                      <div>
                        {chem.usageFrequency === 'bukan_selalu' ? (
                          <span className="text-amber-400 font-medium">
                            ★ Pelarut Khas (Bukan Selalu Pakai)
                          </span>
                        ) : chem.isSolvent ? (
                          <span className="text-slate-300">
                            Pelarut Rutin (Selalu Pakai)
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            Bahan Kimia Padat / Reagen
                          </span>
                        )}
                      </div>
                      {chem.storageLocation && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Lokasi: {chem.storageLocation}
                        </div>
                      )}
                    </td>

                    {/* Purpose */}
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="text-slate-300 text-xs leading-relaxed">{chem.purpose}</div>
                      {chem.notes && (
                        <div className="text-[11px] text-slate-400 italic mt-0.5">
                          Nota: {chem.notes}
                        </div>
                      )}
                    </td>

                    {/* Stock & Threshold */}
                    <td className="px-4 py-3">
                      <div className="flex items-baseline gap-1 font-mono tabular-nums text-xs font-semibold">
                        <span className={chem.currentStock === 0 ? 'text-rose-400 font-bold' : 'text-white'}>
                          {chem.currentStock}
                        </span>
                        <span className="text-slate-500 text-[11px]">{chem.unit}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Min had: {chem.minThreshold} {chem.unit}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {chem.status === 'Habis' ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Habis (0 {chem.unit})
                        </span>
                      ) : chem.status === 'Rendah' ? (
                        <span className="text-amber-300 font-medium">
                          Baki Rendah
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Mencukupi
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                      {chem.status !== 'Habis' ? (
                        <button
                          onClick={() => handleQuickStatusChange(chem, 'Habis')}
                          className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-rose-950/60 text-rose-300 border border-slate-700/80 hover:border-rose-800/80 rounded transition-colors"
                          title="Klik apabila bahan ini telah habis digunakan"
                        >
                          Tanda Habis
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickStatusChange(chem, 'Tersedia')}
                          className="px-2 py-1 text-[11px] bg-emerald-950 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60 rounded font-medium transition-colors inline-flex items-center gap-1"
                          title="Klik apabila bekalan bahan telah sampai"
                        >
                          <PackagePlus className="w-3 h-3" />
                          <span>Restock</span>
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(chem)}
                        className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {currentRole === 'boss' && (
                        <button
                          onClick={() => onDeleteChemical(chem.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Padam rekod reagen (Boss Sahaja)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / New Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1420] border border-slate-800 rounded-xl w-full max-w-md p-5 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              {editingChemical ? 'Kemaskini Maklumat Bahan Kimia / Pelarut' : 'Daftar Bahan / Pelarut Baru'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Kemas kini maklumat pelarut sama ada pelarut rutin atau pelarut bukan selalu pakai.
            </p>

            <form onSubmit={handleSave} className="space-y-3 text-xs overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nama Bahan / Pelarut</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Tetrahydrofuran (THF Anhydrous)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Formula Kimia</label>
                  <input
                    type="text"
                    required
                    value={chemicalFormula}
                    onChange={(e) => setChemicalFormula(e.target.value)}
                    placeholder="Contoh: C4H8O / CHCl3"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit Sukatan</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Liter">Liter</option>
                    <option value="ml">ml</option>
                    <option value="Kg">Kg</option>
                    <option value="Gram">Gram</option>
                    <option value="Botol">Botol</option>
                    <option value="Kotak">Kotak</option>
                  </select>
                </div>
              </div>

              {/* Solvent Classification Selection */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={isSolvent}
                    onChange={(e) => setIsSolvent(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 w-3.5 h-3.5"
                  />
                  <span className="font-medium">Adakah ini sejenis Pelarut (Solvent)?</span>
                </label>

                {isSolvent && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Kekerapan Penggunaan:</label>
                      <select
                        value={usageFrequency}
                        onChange={(e) => setUsageFrequency(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="bukan_selalu">
                          ★ Pelarut Khas (Bukan Selalu Pakai / Non-Routine R&D)
                        </option>
                        <option value="rutin">
                          Pelarut Rutin (Selalu Pakai)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Lokasi Penyimpanan Khusus:</label>
                      <input
                        type="text"
                        value={storageLocation}
                        onChange={(e) => setStorageLocation(e.target.value)}
                        placeholder="Contoh: Kabinet Flammable B (Rak 2) / Almari Wasap"
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 placeholder-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tujuan / Digunakan Dalam Ujian</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Contoh: Pelarut khas ujian pembengkakan tautan silang dan GPC"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Baki Stok Semasa</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Paras Ambang Minima</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Catatan Makmal</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Punca kehabisan, pembekal khas, atau kaedah keselamatan..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition-colors shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
