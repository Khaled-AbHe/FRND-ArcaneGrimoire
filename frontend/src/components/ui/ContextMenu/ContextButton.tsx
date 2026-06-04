import { ArcanumRowVariant, SpellRowVariant } from "../../slots/rows/SpellRow";
import { ContextMenu } from "./ContextMenu";
import { ContextOption } from "./ContextOption";

interface ContextButtonProps {
  value: string;
  title: string;
  variant: SpellRowVariant | ArcanumRowVariant;
  contextMenu: boolean;
  setContextMenu: React.Dispatch<React.SetStateAction<any>>;
  contextOptions: any[];
  onClick: (param: any) => void;
}

export function ContextButton({
  value,
  title,
  variant,
  contextMenu,
  setContextMenu,
  contextOptions,
  onClick,
}: ContextButtonProps) {
  return (
    <div className="relative h-[35px] flex-1 p-1">
      <button
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          console.log("context click");
          setContextMenu(true);
        }}
        className={`${variant.kind === "arcanum" ? "btn-arcanum" : "btn-primary"} h-full w-full justify-center text-[14px]`}
        title={title}
      >
        {value}
      </button>

      {contextMenu && (
        <div className="border">
          <ContextMenu onClose={() => setContextMenu(false)}>
            {contextOptions.map(({ mode, label, color }) => (
              <ContextOption
                key={label}
                title={label}
                color={color}
                onClick={() => onClick(mode)}
              />
            ))}
          </ContextMenu>
        </div>
      )}
    </div>
  );
}
