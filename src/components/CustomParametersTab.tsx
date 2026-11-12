import React, { useState } from 'react';
import { ParameterInputType, TestParameter, UserRole, ChemicalItem } from '../types/lims';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock,
  FlaskConical,
  Sparkles
} from 'lucide-react';

interface CustomParametersTabProps {
  currentRole: UserRole;
  parameters: TestParameter[];
  chemicals: ChemicalItem[];
  onAddParameter: (param: TestParameter) => void;
  onUpdateParameter: (param: TestParameter) => void;
  onDeleteParameter: (id: string) => void;
  onRoleSwitch: (role: UserRole) => void;
}

export const CustomParametersTab: React.FC<CustomParametersTabProps> = ({
  currentRole,
  parameters,
  chemicals,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
  onRoleSwitch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<TestParameter | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'NR' | 'Non-NR' | 'All'>('All');
  const [type, setType] = useState<ParameterInputType>('numeric');
  const [unit, setUnit] = useState('');
  const [minLimit, setMinLimit] = useState<number | undefined>(undefined);
  const [maxLimit, setMaxLimit] = useState<number | undefined>(undefined);
  const [standardMethod, setStandardMethod] = useState('');
  const [description, setDescription] = useState('');
  const [requiredChemicalId, setRequiredChemicalId] = useState<string>('');

  // Solvent customization state
  const [usesSolvent, setUsesSolvent] = useState(false);
  const [solventCategory, setSolventCategory] = useState<'none' | 'rutin' | 'bukan_selalu' | 'fleksibel'>('none');
  const [defaultSolvent, setDefaultSolvent] = useState('Toluene (C7H8 - Standard)');
  const [supportedSolventsText, setSupportedSolventsText] = useState(
    'Tetrahydrofuran (THF - Pelarut Khas), Kloroform (CHCl3 - Pelarut Khas), Sikloheksana (C6H12 - Pelarut Khas), Toluene (C7H8 - Standard)'
  );

  const openNewModal = () => {
    setEditingParam(null);
    setName('');
    setCategory('All');
    setType('numeric');
    setUnit('MU');
    setMinLimit(50);
    setMaxLimit(70);
    setStandardMethod('ISO 289-1');
    setDescription('');
    setRequiredChemicalId('');
    setUsesSolvent(false);
    setSolventCategory('none');
    setDefaultSolvent('Toluene (C7H8 - Standard)');
    setSupportedSolventsText(
      'Tetrahydrofuran (THF - Pelarut Khas), Kloroform (CHCl3 - Pelarut Khas), Sikloheksana (C6H12 - Pelarut Khas), Toluene (C7H8 - Standard)'
    );
    setIsModalOpen(true);
  };

  const openEditModal = (param: TestParameter) => {
    setEditingParam(param);
    setName(param.name);
    setCategory(param.category);
    setType(param.type);
    setUnit(param.unit || '');
    setMinLimit(param.minLimit);
    setMaxLimit(param.maxLimit);
    setStandardMethod(param.standardMethod || '');
    setDescription(param.description || '');
    setRequiredChemicalId(param.requiredChemicalId || '');
    setUsesSolvent(param.usesSolvent || false);
    setSolventCategory(param.solventCategory || (param.usesSolvent ? 'bukan_selalu' : 'none'));
    setDefaultSolvent(param.defaultSolvent || 'Toluene (C7H8 - Standard)');
    setSupportedSolventsText(
      (param.supportedSolvents && param.supportedSolvents.length > 0)
        ? param.supportedSolvents.join(', ')
        : 'Tetrahydrofuran (THF - Pelarut Khas), Kloroform (CHCl3 - Pelarut Khas), Sikloheksana (C6H12 - Pelarut Khas), Toluene (C7H8 - Standard)'
    );
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const supportedList = usesSolvent
      ? supportedSolventsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    if (editingParam) {
      onUpdateParameter({
        ...editingParam,
        name,
        category,
        type,
        unit: type === 'numeric' ? unit : undefined,
        minLimit: type === 'numeric' ? minLimit : undefined,
        maxLimit: type === 'numeric' ? maxLimit : undefined,
        standardMethod,
        description,
        requiredChemicalId: requiredChemicalId || undefined,
        usesSolvent,
        solventCategory: usesSolvent ? solventCategory : 'none',
        defaultSolvent: usesSolvent ? defaultSolvent : undefined,
        supportedSolvents: supportedList,
      });
    } else {
      const newParam: TestParameter = {
        id: `p-${Date.now()}`,
        name,
        category,
        type,
        unit: type === 'numeric' ? unit : undefined,
        minLimit: type === 'numeric' ? minLimit : undefined,
        maxLimit: type === 'numeric' ? maxLimit : undefined,
        standardMethod,
        description,
        requiredChemicalId: requiredChemicalId || undefined,
        usesSolvent,
        solventCategory: usesSolvent ? solventCategory : 'none',
        defaultSolvent: usesSolvent ? defaultSolvent : undefined,
        supportedSolvents: supportedList,
      };
      onAddParameter(newParam);
    }
    setIsModalOpen(false);
  };

  const solventChemicals = chemicals.filter((c) => c.isSolvent || c.purpose.toLowerCase().includes('pelarut'));

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Konfigurasi Standard & Custom Test Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Spesifikasi had toleransi ujian getah ISO 17025. Anda boleh mengkonfigurasi ujian mengikut solvent biasa atau pelarut bukan rutin (bukan selalu pakai).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'boss' ? (
            <button
              onClick={openNewModal}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bina Parameter Baharu</span>
            </button>
          ) : (
            <button
              onClick={() => onRoleSwitch('boss')}
              className="px-3 py-1.5 bg-[#121824] hover:bg-slate-800 text-amber-300 border border-amber-800/60 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Tukar ke Mod Boss untuk Sunting</span>
            </button>
          )}
        </div>
      </div>

      {/* Specifications Table */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-[#0b101b] text-slate-400 text-[11px] font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">ID & Nama Parameter</th>
                <th className="px-4 py-3 font-semibold">Kategori Getah</th>
                <th className="px-4 py-3 font-semibold">Pelarut / Solvent</th>
                <th className="px-4 py-3 font-semibold">Had Spesifikasi</th>
                <th className="px-4 py-3 font-semibold">Kaedah Piawaian</th>
                <th className="px-4 py-3 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {parameters.map((param) => {
                const linkedChemical = chemicals.find((c) => c.id === param.requiredChemicalId);

                return (
                  <tr
                    key={param.id}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{param.name}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                        {param.id} {param.description && `· ${param.description}`}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-slate-300 font-medium">
                        {param.category === 'NR' ? 'Getah Asli (NR)' : param.category === 'Non-NR' ? 'Sintetik (Non-NR)' : 'Semua Getah'}
                      </span>
                    </td>

                    {/* Solvent / Chemical indicator */}
                    <td className="px-4 py-3">
                      {param.usesSolvent ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-slate-200">
                            <FlaskConical className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{param.defaultSolvent || 'Pelarut Fleksibel'}</span>
                          </div>
                          <div className="text-[10px] mt-0.5">
                            {param.solventCategory === 'bukan_selalu' ? (
                              <span className="text-amber-400 font-medium">
                                ★ Pelarut Khas (Bukan Selalu Pakai)
                              </span>
                            ) : param.solventCategory === 'fleksibel' ? (
                              <span className="text-sky-400 font-medium">
                                Fleksibel (Boleh pilih pelarut khas)
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">
                                Pelarut Standard Rutin
                              </span>
                            )}
                          </div>
                        </div>
                      ) : linkedChemical ? (
                        <div className="text-slate-400 text-[11px]">
                          Reagen: <span className="text-slate-300 font-medium">{linkedChemical.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Tanpa Pelarut</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono tabular-nums">
                      {param.type === 'numeric' ? (
                        <div className="font-semibold text-slate-200">
                          {param.minLimit !== undefined && param.maxLimit !== undefined
                            ? `${param.minLimit} – ${param.maxLimit} ${param.unit || ''}`
                            : param.maxLimit !== undefined
                            ? `Maks. ${param.maxLimit} ${param.unit || ''}`
                            : `Min. ${param.minLimit} ${param.unit || ''}`}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Kriteria kualitatif</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                      {param.standardMethod || 'MS 1387'}
                    </td>

                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                      {currentRole === 'boss' ? (
                        <>
                          <button
                            onClick={() => openEditModal(param)}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-amber-400" />
                            <span>Sunting</span>
                          </button>
                          <button
                            onClick={() => onDeleteParameter(param.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Padam parameter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500">Disahkan oleh Boss</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Solvent Customization */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1420] border border-slate-800 rounded-xl w-full max-w-lg p-5 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              {editingParam ? 'Sunting Parameter Ujian' : 'Takrifkan Parameter Ujian Baharu'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Pengurus Makmal (Boss) mentakrifkan spesifikasi piawaian termasuk pilihan solvent bukan rutin.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nama Parameter Ujian</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Indeks Pembengkakan Pelarut Khas (Solvent Swelling)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kategori Getah</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">Semua Jenis Getah</option>
                    <option value="NR">Getah Asli (NR Sahaja)</option>
                    <option value="Non-NR">Non-NR Sintetik Sahaja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Format Input</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="numeric">Nombor (Dengan Had Min/Maks)</option>
                    <option value="text">Pemerhatian Teks</option>
                    <option value="attachment">Graf / Lengkuk Reometer</option>
                  </select>
                </div>
              </div>

              {type === 'numeric' && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Unit</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. q, %, MU, MPa"
                      className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Had Min</label>
                    <input
                      type="number"
                      step="any"
                      value={minLimit ?? ''}
                      onChange={(e) => setMinLimit(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      placeholder="2.5"
                      className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Had Maks</label>
                    <input
                      type="number"
                      step="any"
                      value={maxLimit ?? ''}
                      onChange={(e) => setMaxLimit(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      placeholder="5.5"
                      className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Solvent Customization Box (Specific feature requested by user) */}
              <div className="p-3.5 bg-slate-900/90 border border-emerald-900/40 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Konfigurasi Pelarut / Solvent Ujian</span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={usesSolvent}
                      onChange={(e) => {
                        setUsesSolvent(e.target.checked);
                        if (e.target.checked && solventCategory === 'none') {
                          setSolventCategory('bukan_selalu');
                        }
                      }}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>Guna Solvent Kimia</span>
                  </label>
                </div>

                {usesSolvent && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Kategori Penggunaan Pelarut
                      </label>
                      <select
                        value={solventCategory}
                        onChange={(e) => setSolventCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="bukan_selalu">
                          ★ Pelarut Khas / Bukan Selalu Pakai (THF, Kloroform, MEK, Sikloheksana)
                        </option>
                        <option value="fleksibel">
                          Fleksibel (Staf boleh pilih sama ada pelarut rutin atau pelarut bukan rutin)
                        </option>
                        <option value="rutin">
                          Pelarut Rutin (Selalu pakai: Toluene / Aseton piawai)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Pelarut Lalai (Default Solvent)
                      </label>
                      <input
                        type="text"
                        value={defaultSolvent}
                        onChange={(e) => setDefaultSolvent(e.target.value)}
                        placeholder="Contoh: Tetrahydrofuran (THF - Pelarut Khas)"
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Senarai Pelarut Alternatif Dibenarkan (Pisahkan dengan koma):
                      </label>
                      <textarea
                        rows={2}
                        value={supportedSolventsText}
                        onChange={(e) => setSupportedSolventsText(e.target.value)}
                        placeholder="THF, Kloroform, Sikloheksana, Metil Etil Keton, Toluene"
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kaedah Piawaian (ISO / ASTM)</label>
                  <input
                    type="text"
                    value={standardMethod}
                    onChange={(e) => setStandardMethod(e.target.value)}
                    placeholder="Contoh: ISO 1817 / ASTM D471"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pautan Stok Reagen (Pilihan)</label>
                  <select
                    value={requiredChemicalId}
                    onChange={(e) => setRequiredChemicalId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Pautkan dengan Reagen Inventori --</option>
                    {solventChemicals.map((chem) => (
                      <option key={chem.id} value={chem.id}>
                        {chem.name} ({chem.usageFrequency === 'bukan_selalu' ? 'Pelarut Khas' : 'Rutin'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Keterangan / Kaedah Ujian</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan protokol ujian dengan pelarut khas..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-amber-500"
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
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md font-semibold transition-colors shadow-sm"
                >
                  Simpan Spesifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
