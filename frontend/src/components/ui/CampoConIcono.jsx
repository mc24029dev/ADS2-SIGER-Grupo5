/**
 * Campo de formulario con etiqueta e icono a la izquierda.
 * - `icono`: componente de lucide-react (por ejemplo, Mail).
 * - `derecha`: elemento opcional alineado a la derecha dentro del campo
 *   (por ejemplo, el botón de mostrar u ocultar la contraseña).
 * - El resto de props (type, value, onChange, placeholder, autoComplete,
 *   required, disabled, name...) pasan directo al <input>.
 */
export default function CampoConIcono({
  id,
  etiqueta,
  icono: Icono,
  derecha,
  ...inputProps
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-label-caps text-on-surface-variant uppercase mb-1.5 block"
      >
        {etiqueta}
      </label>

      <div className="group relative flex items-center w-full">
        <Icono
          size={20}
          aria-hidden="true"
          className="absolute left-3.5 text-outline pointer-events-none transition-colors duration-200 group-focus-within:text-primary"
        />

        <input
          id={id}
          className={`w-full h-11 pl-11 ${
            derecha ? "pr-11" : "pr-4"
          } bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md rounded-lg outline-none shadow-[inset_0_0_0_1px_rgba(226,232,240,1)] transition-all duration-200 focus:shadow-[inset_0_0_0_1.5px_#0058be,0_0_0_3px_rgba(0,88,190,0.15)] disabled:opacity-70 disabled:cursor-not-allowed`}
          {...inputProps}
        />

        {derecha && <div className="absolute right-3 flex items-center">{derecha}</div>}
      </div>
    </div>
  )
}