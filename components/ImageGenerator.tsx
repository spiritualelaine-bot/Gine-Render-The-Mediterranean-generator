import React, { useState } from 'react';
import { generateCinematicImage } from '../services/geminiService';
import { ImageAspectRatio } from '../types';
import { Loader2, Download, RefreshCw, Image as ImageIcon, User, Smile, Shirt, Package, Camera, Scissors, Scroll, Info, Wind, Fingerprint, Lock } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('16:9');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateCinematicImage(prompt, aspectRatio);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const appendToPrompt = (text: string) => {
    setPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return text;
      // If it doesn't end with punctuation, add a comma
      if (!/[.,;]$/.test(cleanPrev)) {
        return `${cleanPrev}, ${text}`;
      }
      return `${cleanPrev} ${text}`;
    });
  };

  const isScribeLocked = prompt.includes("MediterraneanScribe_Consistency_V1");

  const applyScribePreset = () => {
    const seed = "--character-consistency-seed MediterraneanScribe_Consistency_V1";
    const description = "Base character: mid-40s Middle Eastern Jewish scribe, weathered olive skin, thick curly dark-brown beard with natural gray streaks, deep-set intense brown eyes, subtle forehead creases, strong but kind facial structure, short curly hair partially covered by a coarse beige woven head cloth. Wearing off-white rough woolen robe with visible weave texture and slight fraying at cuffs. Ink-stained fingers (index and middle finger of left hand have permanent black marks). Exact likeness must be preserved.";
    
    setPrompt(prev => {
       if (prev.includes(seed)) return prev;
       return `${seed}\n${description}\n\n${prev}`;
    });
  };

  const ratios: ImageAspectRatio[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

  const emotions = [
    { label: 'Contemplation', text: 'showing an expression of deep spiritual contemplation, brow slightly furrowed in thought' },
    { label: 'Prayer', text: 'eyes closed in fervent prayer, hands clasped, face uplifted to the heavens' },
    { label: 'Writing', text: 'focused intently on writing parchment, quill in hand, ink stained fingers' },
    { label: 'Teaching', text: 'gesturing with authority while teaching, mouth open in speech, engaging eye contact' },
    { label: 'Solemn Reflection', text: 'lost in solemn reflection, gaze cast downward, somber expression' },
    { label: 'Anguish', text: 'face twisted in anguish, tears welling up, raw emotional pain' },
    { label: 'Determined Resolve', text: 'expression of determined resolve, jaw set, steely gaze, unshakeable' },
    { label: 'Joyful Proclamation', text: 'radiating joyful proclamation, wide smile, arms open wide, ecstatic' },
    { label: 'Awe', text: 'eyes wide in holy awe, mouth slightly agape, overwhelmed by glory' },
    { label: 'Weeping', text: 'weeping quietly, tears streaming down face, sorrowful' }
  ];

  const facialDetails = [
    { label: 'Sun-burnt', text: 'golden sun-burnt mediterranean skin tone, glowing in the light' },
    { label: 'Ascetic', text: 'lean ascetic facial structure, hollow cheeks, intense eyes' },
    { label: 'Detailed Pores', text: 'hyper-realistic skin texture, visible pores, fine lines' },
    { label: 'Weather-beaten', text: 'weather-beaten features telling a story of hardship and travel' },
    { label: 'Ancient Wisdom', text: 'deep wrinkles lining the face, eyes full of ancient wisdom and years' },
    { label: 'Rugged', text: 'rugged fisherman features, windburn, strong jawline, rough beard' },
    { label: 'Scribe', text: 'scholarly appearance, observant eyes, delicate features, ink stains' },
    { label: 'Roman Noble', text: 'clean shaven, sharp aristocratic nose, haughty expression' },
    { label: 'Facial Scars', text: 'visible healed facial scarring adding character history and texture' },
    { label: 'Birthmarks', text: 'distinct natural birthmark on the skin' },
    { label: 'Freckles', text: 'natural scattering of sun-kissed freckles across the nose and cheeks' },
    { label: 'Moles', text: 'distinctive realistic facial beauty marks or moles' },
    { label: 'Skin Blemishes', text: 'hyper-realistic skin texture with natural blemishes and organic imperfections' },
    { label: 'Sun Spots', text: 'sun spots and pigmentation from exposure to the harsh desert sun' },
    { label: 'Sweat Sheen', text: 'skin glistening with a realistic layer of sweat and humidity' },
    { label: 'Dust & Grime', text: 'fine layer of desert dust and grime clinging to the skin' },
    { label: 'Prominent Cheekbones', text: 'high, prominent cheekbones casting dramatic shadows' },
    { label: 'Sharp Jawline', text: 'sharp, defined jawline denoting strength' },
    { label: 'Full Lips', text: 'naturally full and expressive lips' },
    { label: 'Thin Lips', text: 'thin, stern lips set in a straight line' },
    { label: 'Aquiline Nose', text: 'distinctive aquiline nose with a strong bridge' },
    { label: 'Button Nose', text: 'small, rounded button nose softening the features' }
  ];

  const clothingStyles = [
    { label: 'Faded Tunic', text: 'wearing a simple faded tunic of rough woven fabric' },
    { label: 'Leather Sandals', text: 'wearing worn leather sandals coated in desert dust' },
    { label: 'Linen Robe', text: 'draped in a fine linen robe with natural folding' },
    { label: 'Woolen Cloak', text: 'wrapped in a heavy woolen cloak for protection against the elements' },
    { label: 'Head Covering', text: 'wearing a traditional head covering casting a shadow over the brow' },
    { label: 'Sim-lah', text: 'wearing a traditional Sim-lah outer garment draped over the shoulders' },
    { label: 'Scribe Apron', text: 'wearing a practical scribe\'s apron stained with black ink' }
  ];

  const hairStyles = [
    // Judean Men
    { label: 'Judean Wavy (M)', text: 'Shoulder-length wavy dark hair, neatly parted in the middle' },
    { label: 'Judean Short Curl (M)', text: 'Short curled hair with a trimmed beard' },
    { label: 'Judean Tied Curls (M)', text: 'Long natural curls tied loosely with a leather cord' },
    { label: 'Judean Payot (M)', text: 'Short hair with temple curls (payot style—subtle, period-appropriate)' },
    { label: 'Judean Square Beard (M)', text: 'Coarse sun-touched brown hair, full beard shaped square' },
    // Judean Women
    { label: 'Judean Braided Updo (F)', text: 'Thick, dark braided updos wrapped with cloth bands' },
    { label: 'Judean Loose Waves (F)', text: 'Loose waves flowing over the shoulders, tied with a bronze pin' },
    { label: 'Judean Beaded Braids (F)', text: 'Multi-strand braids decorated with simple beads' },
    { label: 'Judean Knot Veil (F)', text: 'Pulled-back knot with linen veil' },
    // Greek Men
    { label: 'Greek Caesar (M)', text: 'Close-cropped “Caesar” cut with forward-combed fringe' },
    { label: 'Greek Groomed (M)', text: 'Short waves with a well-groomed beard or stubble' },
    { label: 'Greek Military (M)', text: 'Simple military cut—short, tidy, functional' },
    { label: 'Greek Curled Ears (M)', text: 'Slightly longer hair curled around the ears' },
    // Greek Women
    { label: 'Greek Ornate Bun (F)', text: 'Multi-layered braided styles folded into ornate buns' },
    { label: 'Greek Nodus (F)', text: 'Waves curled over the forehead (“nodus” style)' },
    { label: 'Greek Gold Thread (F)', text: 'Hair wrapped in golden thread or woolen ribbons' },
    { label: 'Greek Back-Braids (F)', text: 'Intricate back-braids with pins' },
    { label: 'Bound Headscarf', text: 'tightly bound headscarf' },
    // North African Men
    { label: 'N. African Tight Curls (M)', text: 'Short tight curls, well-shaped' },
    { label: 'N. African Headwrap (M)', text: 'Shoulder-length textured hair with a linen headwrap' },
    { label: 'N. African Braided Beads (M)', text: 'Braided sections with beads at the ends' },
    { label: 'N. African Long Beard (M)', text: 'Cropped natural curls with long thin beard' },
    // North African Women
    { label: 'N. African Clay Beads (F)', text: 'Thick braids with clay or wooden beads' },
    { label: 'N. African Gold Discs (F)', text: 'Shoulder-length natural curls adorned with gold discs' },
    { label: 'N. African Braided Knot (F)', text: 'Long braided rows pulled back in a knot' },
    { label: 'N. African Veil (F)', text: 'Loose curls with linen veil draped behind' },
    // Nubian/General
    { label: 'Afro Curls (M)', text: 'Short afro curls naturally shaped' },
    { label: 'Tight Braids Back (M)', text: 'Tight braids pulled back' },
    { label: 'Locs & Beard (M)', text: 'Short locs with trimmed beard' },
    { label: 'Crown of Curls (M)', text: 'Crown of curls with headband' },
    { label: 'Coiled Braids (F)', text: 'Thick coiled braids adorned with beads' },
    { label: 'Medium Afro Comb (F)', text: 'Medium afro with decorative comb' },
    { label: 'Braided Rows Bun (F)', text: 'Braided rows tied into a back bun' },
    { label: 'Wrapped Locs (F)', text: 'Locs wrapped in colorful linen' },
    { label: 'Shaved Head', text: 'shaved head' }
  ];

  const environmentalDetails = [
    { label: 'Wax Sealed Jars', text: 'olive oil jars sealed with wax' },
    { label: 'Sooty Clay Lamps', text: 'clay lamps with soot stains near the wick' },
    { label: 'Fruit Bowls', text: 'bowls of figs, grapes, and pomegranates' },
    { label: 'Rolled Wool', text: 'rolled wool garments' },
    { label: 'Bone Needles', text: 'bone needles' },
    { label: 'Hemp Cord', text: 'hemp cord' },
    { label: 'Wooden Floats', text: 'small wooden floats' },
    { label: 'Stone Weights', text: 'stone weights' },
    { label: 'Silver Fish', text: 'silver-scaled fish' },
    { label: 'Octopus', text: 'octopus tentacles' },
    { label: 'Dried Seaweed', text: 'dried seaweed used for wrapping jars' },
    { label: 'Repairing Boats', text: 'a row of small wooden boats rests on the sand, overturned for repair' },
    { label: 'Perfume Bottles', text: 'clay perfume bottles' },
    { label: 'Copper Bracelets', text: 'copper bracelets' },
    { label: 'Honey Jars', text: 'honey jars sealed with linen' },
    { label: 'Flatbread Baskets', text: 'fresh flatbread stacked in reed baskets' },
    { label: 'Hanging Wineskins', text: 'wine skins hanging from a wooden beam' },
    { label: 'Dyed Wool Racks', text: 'brightly dyed wool hung on racks to dry' },
    { label: 'Olive Branches', text: 'olive branches' },
    { label: 'Shell Offerings', text: 'shell offerings' },
    { label: 'Incense Ash', text: 'a bronze bowl filled with burnt incense ash' },
    { label: 'Merchant Crates', text: 'wooden crates stamped with merchant seals' },
    { label: 'Amphorae', text: 'amphorae containing wine, olive oil, garum (fish sauce), and grain' },
    { label: 'Thick Ropes', text: 'coiled ropes thick as a man’s wrist' },
    { label: 'Iron Anchors', text: 'iron anchors' },
    { label: 'Steaming Tar Pots', text: 'tar pots steaming beside charcoal braziers' },
    { label: 'Bronze-banded Carts', text: 'rolling carts with bronze-banded wheels' }
  ];

  const detailedElements = [
    { label: 'Tented Workspace', text: 'Inside a small tented workspace nearby, quills rest beside ink pots made of carved bone. Papyrus scrolls, wax tablets, and sealed letters lay carefully stacked, ready for messengers. A clay water jug, woven mats, small bronze cups, and a simple oil burner complete the intimate interior' },
    { label: 'Traveler\'s Desk', text: 'A quill scrapes across parchment while sealed letters wait nearby. A woven wool blanket, a clay lantern, water skin, compass-like navigation tools, and a bronze coin pouch lie within reach' },
    { label: 'Bustling Harbor', text: 'Tall masts rise like forest trees along crowded harbors. The sound of hammers repairing ships echoes against seawalls built of massive stone blocks. Ropes, crates of grain, piles of stacked amphorae, and rolled sailcloth clutter the piers. Dock workers wear simple tunics, sweating under the midday sun. Market stalls nearby sell sea salt, iron tools, bread loaves, dried fish, and small carved idols' },
    { label: 'Vibrant Fabrics', text: 'Colorful fabrics—deep purple, ochre, and indigo' },
    { label: 'Rough Wood', text: 'rough-hewn wood grain' },
    { label: 'Cracked Leather', text: 'worn and cracked leather' },
    { label: 'Polished Marble', text: 'smooth polished marble' },
    { label: 'Woven Tapestry', text: 'intricate woven tapestry' },
    { label: 'Rusted Patina', text: 'rusted metal patina' },
    { label: 'Frosted Glass', text: 'frosted glass' }
  ];

  const environmentalAmbiance = [
    { label: 'Gentle Breeze', text: 'gentle breeze rustling fabric and hair' },
    { label: 'Light Rain', text: 'light rain drizzling, wet surfaces reflecting light' },
    { label: 'Snowfall', text: 'soft snowflakes drifting through the air' },
    { label: 'Dusty Air', text: 'air thick with floating dust particles visible in light beams' },
    { label: 'Thick Fog', text: 'dense fog obscuring the background, atmospheric depth' },
    { label: 'Subtle Smoke', text: 'thin wisps of smoke drifting lazily through the scene' }
  ];

  const cinematicStyles = [
    { label: 'Shallow Depth', text: 'shallow depth of field with soft background bokeh' },
    { label: 'Wide Angle', text: 'shot with a wide-angle lens capturing the vast environment' },
    { label: 'Telephoto', text: 'shot with a telephoto lens compressing the background' },
    { label: 'Anamorphic', text: 'anamorphic lens flare with cinematic horizontal streaks' },
    { label: 'Teal & Orange', text: 'cinematic color grading with teal and orange tones' },
    { label: 'Film Grain', text: 'visible 35mm film grain texture' },
    { label: 'Motion Blur', text: 'cinematic motion blur accentuating movement' },
    { label: '50mm Lens', text: 'simulated 50mm lens' },
    { label: '85mm Portrait', text: 'simulated 85mm portrait lens' },
    { label: 'Wide Architectural', text: 'simulated wide-angle architectural lens' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-amber-50 mb-2">Character & World Generation</h2>
        <p className="text-stone-400">Create photorealistic ancient Judean landscapes and characters using Gemini 3 Pro.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Character Consistency Section */}
          <div className={`border rounded-lg p-4 transition-all duration-500 ${isScribeLocked ? 'bg-amber-950/40 border-amber-600/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-amber-950/20 border-amber-900/30'}`}>
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider text-xs">
                  <Fingerprint size={14} />
                  <span>MediterraneanScribe_Consistency_V1</span>
                </div>
                {isScribeLocked && (
                  <div className="flex items-center gap-1 text-[10px] bg-amber-600 text-stone-950 px-2 py-0.5 rounded font-bold animate-pulse">
                    <Lock size={10} />
                    LOCKED
                  </div>
                )}
             </div>
             <p className="text-xs text-stone-400 mb-4 leading-relaxed">
               When enabled, every generated image will feature the identical scribe from the original reference.
             </p>
             <button 
                onClick={applyScribePreset}
                disabled={isScribeLocked}
                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2
                  ${isScribeLocked 
                    ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50 cursor-default' 
                    : 'bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200'}`}
             >
               <Fingerprint size={16} />
               {isScribeLocked ? 'Same Scribe (Locked)' : 'Lock Scribe Consistency'}
             </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-stone-300">Scene Description</label>
            </div>
            <textarea
              className="w-full h-40 bg-stone-900 border border-stone-700 rounded-lg p-3 text-stone-200 focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none placeholder-stone-600"
              placeholder="e.g., Apostle Paul writing in a dimly lit stone room, dust motes dancing in a beam of sunlight, cinematic lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
             <div className="text-xs text-stone-500 bg-stone-800/30 p-3 rounded-lg border border-stone-800 mt-2">
              <div className="flex items-center gap-2 mb-2 text-stone-400">
                  <Info size={14} />
                  <p className="font-semibold">Pro Tip: Effective Structure</p>
              </div>
              <p className="leading-relaxed mb-2">
                <span className="text-amber-600 font-medium">[Subject + Action]</span> + 
                <span className="text-amber-500 font-medium"> [Environment]</span> + 
                <span className="text-stone-400 font-medium"> [Lighting/Atmosphere]</span> + 
                <span className="text-stone-500 font-medium"> [Cinematic Details]</span>
              </p>
              <p className="italic opacity-60 border-l-2 border-stone-700 pl-2">
                "A weathered fisherman mending nets (Subject), on a rocky shore at sunset (Env), heavy mist and warm backlight (Light), telephoto lens (Cam)."
              </p>
            </div>
          </div>

           {/* Enhancers */}
           <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Smile size={14} />
                    <span>Expressions</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {emotions.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <User size={14} />
                    <span>Facial Details</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {facialDetails.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Shirt size={14} />
                    <span>Clothing Styles</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {clothingStyles.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Scissors size={14} />
                    <span>Hair Styles</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {hairStyles.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Package size={14} />
                    <span>Small Props</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {environmentalDetails.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Scroll size={14} />
                    <span>High-Detail Elements & Textures</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {detailedElements.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Wind size={14} />
                    <span>Environmental Ambiance</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {environmentalAmbiance.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
                    <Camera size={14} />
                    <span>Cinematic Style</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {cinematicStyles.map((item) => (
                       <button
                          key={item.label}
                          onClick={() => appendToPrompt(item.text)}
                          className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-stone-300 rounded border border-stone-700 transition-all"
                       >
                          {item.label}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-300">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-2 py-2 text-xs rounded border transition-colors
                    ${aspectRatio === r 
                      ? 'bg-amber-600 border-amber-500 text-white' 
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Generate Render
          </button>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 text-red-300 rounded text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center min-h-[600px] overflow-hidden relative">
          {generatedImage ? (
            <div className="relative w-full h-full flex items-center justify-center group bg-black">
              <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain shadow-2xl" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={generatedImage} 
                  download={`render-${Date.now()}.png`}
                  className="p-3 bg-stone-950/80 text-white rounded-full hover:bg-amber-600 transition-colors flex"
                >
                  <Download size={20} />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-stone-600 flex flex-col items-center gap-4">
               <div className="w-20 h-20 border-2 border-dashed border-stone-700 rounded-full flex items-center justify-center">
                 <ImageIcon className="w-8 h-8" />
               </div>
               <p>Enter a prompt to begin rendering</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};