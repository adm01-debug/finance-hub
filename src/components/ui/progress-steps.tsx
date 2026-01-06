import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type StepStatus = 'pending' | 'current' | 'completed' | 'error';

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  optional?: boolean;
}

export interface ProgressStepsProps {
  /** Lista de steps */
  steps: Step[];
  /** Index do step atual (0-based) */
  currentStep: number;
  /** Callback ao clicar em step */
  onStepClick?: (stepIndex: number) => void;
  /** Permitir navegar clicando */
  allowNavigation?: boolean;
  /** Orientação */
  orientation?: 'horizontal' | 'vertical';
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Steps com erro (array de indices) */
  errorSteps?: number[];
  /** Steps carregando (array de indices) */
  loadingSteps?: number[];
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// PROGRESS STEPS COMPONENT
// =============================================================================

export function ProgressSteps({
  steps,
  currentStep,
  onStepClick,
  allowNavigation = false,
  orientation = 'horizontal',
  size = 'md',
  errorSteps = [],
  loadingSteps = [],
  className,
}: ProgressStepsProps) {
  const getStepStatus = (index: number): StepStatus => {
    if (errorSteps.includes(index)) return 'error';
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const isClickable = (index: number) => {
    if (!allowNavigation) return false;
    // Allow click on completed or previous steps
    return index <= currentStep;
  };

  const sizeClasses = {
    sm: {
      step: 'h-6 w-6 text-xs',
      label: 'text-xs',
      description: 'text-[10px]',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      gap: orientation === 'horizontal' ? 'gap-2' : 'gap-1',
    },
    md: {
      step: 'h-8 w-8 text-sm',
      label: 'text-sm',
      description: 'text-xs',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      gap: orientation === 'horizontal' ? 'gap-3' : 'gap-2',
    },
    lg: {
      step: 'h-10 w-10 text-base',
      label: 'text-base',
      description: 'text-sm',
      connector: orientation === 'horizontal' ? 'h-1' : 'w-1',
      gap: orientation === 'horizontal' ? 'gap-4' : 'gap-3',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLoading = loadingSteps.includes(index);
        const clickable = isClickable(index);
        const isLast = index === steps.length - 1;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div
              className={cn(
                'flex',
                orientation === 'horizontal'
                  ? 'flex-col items-center'
                  : 'flex-row items-start',
                sizes.gap
              )}
            >
              {/* Step Indicator */}
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(index)}
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 transition-all',
                  sizes.step,
                  clickable && 'cursor-pointer',
                  !clickable && 'cursor-default',
                  status === 'completed' && 'bg-primary border-primary text-primary-foreground',
                  status === 'current' && 'bg-primary/10 border-primary text-primary',
                  status === 'pending' && 'bg-muted border-muted-foreground/30 text-muted-foreground',
                  status === 'error' && 'bg-destructive/10 border-destructive text-destructive'
                )}
                whileHover={clickable ? { scale: 1.1 } : {}}
                whileTap={clickable ? { scale: 0.95 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </motion.div>
                  ) : status === 'completed' ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : status === 'error' ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </motion.div>
                  ) : Icon ? (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Pulse for current step */}
                {status === 'current' && !isLoading && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                )}
              </motion.button>

              {/* Label & Description */}
              <div
                className={cn(
                  orientation === 'horizontal' ? 'text-center mt-2' : 'ml-3',
                  'flex-1'
                )}
              >
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'font-medium transition-colors',
                      sizes.label,
                      status === 'completed' && 'text-foreground',
                      status === 'current' && 'text-primary',
                      status === 'pending' && 'text-muted-foreground',
                      status === 'error' && 'text-destructive'
                    )}
                  >
                    {step.label}
                  </span>
                  {step.optional && (
                    <span className="text-muted-foreground text-[10px]">(opcional)</span>
                  )}
                </div>
                {step.description && (
                  <p className={cn('text-muted-foreground mt-0.5', sizes.description)}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  'flex-1',
                  orientation === 'horizontal'
                    ? 'min-w-[40px] mt-4'
                    : 'min-h-[24px] ml-4',
                  orientation === 'horizontal' ? 'px-2' : 'py-2'
                )}
              >
                <div
                  className={cn(
                    'relative rounded-full overflow-hidden',
                    orientation === 'horizontal' ? 'w-full' : 'h-full',
                    sizes.connector,
                    'bg-muted'
                  )}
                >
                  <motion.div
                    className={cn(
                      'absolute bg-primary',
                      orientation === 'horizontal'
                        ? 'h-full top-0 left-0'
                        : 'w-full top-0 left-0'
                    )}
                    initial={false}
                    animate={{
                      [orientation === 'horizontal' ? 'width' : 'height']:
                        index < currentStep ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// =============================================================================
// WIZARD COMPONENT
// =============================================================================

export interface WizardProps {
  /** Lista de steps */
  steps: Step[];
  /** Step atual */
  currentStep: number;
  /** Callback ao mudar step */
  onStepChange: (step: number) => void;
  /** Conteúdo de cada step */
  children: React.ReactNode[];
  /** Mostrar navegação */
  showNavigation?: boolean;
  /** Labels dos botões */
  labels?: {
    previous?: string;
    next?: string;
    finish?: string;
    skip?: string;
  };
  /** Callback ao finalizar */
  onFinish?: () => void;
  /** Loading no botão de próximo */
  loading?: boolean;
  /** Desabilitar próximo */
  disableNext?: boolean;
  /** Classes adicionais */
  className?: string;
}

export function Wizard({
  steps,
  currentStep,
  onStepChange,
  children,
  showNavigation = true,
  labels = {},
  onFinish,
  loading = false,
  disableNext = false,
  className,
}: WizardProps) {
  const {
    previous = 'Voltar',
    next = 'Próximo',
    finish = 'Finalizar',
    skip = 'Pular',
  } = labels;

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onFinish?.();
    } else {
      onStepChange(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (!isLast) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress Steps */}
      <ProgressSteps
        steps={steps}
        currentStep={currentStep}
        allowNavigation
        onStepClick={onStepChange}
        loadingSteps={loading ? [currentStep] : []}
      />

      {/* Step Content */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={isFirst || loading}
          >
            <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
            {previous}
          </Button>

          <div className="flex items-center gap-2">
            {currentStepData?.optional && !isLast && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={loading}
              >
                {skip}
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={disableNext || loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLast ? finish : next}
              {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SIMPLE STEPPER (Mini version)
// =============================================================================

export function SimpleStepper({
  total,
  current,
  onStepClick,
  className,
}: {
  total: number;
  current: number;
  onStepClick?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          type="button"
          className={cn(
            'h-2 rounded-full transition-all',
            index === current
              ? 'w-6 bg-primary'
              : index < current
              ? 'w-2 bg-primary/50'
              : 'w-2 bg-muted'
          )}
          onClick={() => onStepClick?.(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// NUMBERED STEPPER
// =============================================================================

export function NumberedStepper({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="text-primary font-semibold">{current + 1}</span>
      <span className="text-muted-foreground">/</span>
      <span className="text-muted-foreground">{total}</span>
    </div>
  );
}

// =============================================================================
// PROGRESS BAR STEPPER
// =============================================================================

export function ProgressBarStepper({
  total,
  current,
  showLabel = true,
  className,
}: {
  total: number;
  current: number;
  showLabel?: boolean;
  className?: string;
}) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">
            {current + 1} de {total}
          </span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// USE WIZARD HOOK
// =============================================================================

export function useWizard(totalSteps: number, initialStep = 0) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [errorSteps, setErrorSteps] = React.useState<number[]>([]);

  const goToStep = React.useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = React.useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const previousStep = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const markStepError = React.useCallback((step: number) => {
    setErrorSteps((prev) => [...new Set([...prev, step])]);
    setCompletedSteps((prev) => prev.filter((s) => s !== step));
  }, []);

  const clearStepError = React.useCallback((step: number) => {
    setErrorSteps((prev) => prev.filter((s) => s !== step));
  }, []);

  const reset = React.useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps([]);
    setErrorSteps([]);
  }, [initialStep]);

  return {
    currentStep,
    completedSteps,
    errorSteps,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    progress: (currentStep / (totalSteps - 1)) * 100,
    goToStep,
    nextStep,
    previousStep,
    markStepError,
    clearStepError,
    reset,
  };
}

// =============================================================================
// PRESETS
// =============================================================================

/** Wizard para criação de conta a pagar */
export function ContaPagarWizard({
  onFinish,
  children,
}: {
  onFinish: () => void;
  children: React.ReactNode[];
}) {
  const wizard = useWizard(4);

  const steps: Step[] = [
    { id: 'fornecedor', label: 'Fornecedor', description: 'Selecione o fornecedor' },
    { id: 'valores', label: 'Valores', description: 'Informe os valores' },
    { id: 'vencimento', label: 'Vencimento', description: 'Data e recorrência' },
    { id: 'revisao', label: 'Revisão', description: 'Confirme os dados' },
  ];

  return (
    <Wizard
      steps={steps}
      currentStep={wizard.currentStep}
      onStepChange={wizard.goToStep}
      onFinish={onFinish}
      labels={{ finish: 'Criar Conta' }}
    >
      {children}
    </Wizard>
  );
}

/** Wizard para importação de extrato */
export function ImportacaoWizard({
  onFinish,
  children,
}: {
  onFinish: () => void;
  children: React.ReactNode[];
}) {
  const wizard = useWizard(3);

  const steps: Step[] = [
    { id: 'arquivo', label: 'Arquivo', description: 'Selecione o arquivo' },
    { id: 'mapeamento', label: 'Mapeamento', description: 'Configure as colunas' },
    { id: 'confirmacao', label: 'Confirmação', description: 'Revise e importe' },
  ];

  return (
    <Wizard
      steps={steps}
      currentStep={wizard.currentStep}
      onStepChange={wizard.goToStep}
      onFinish={onFinish}
      labels={{ finish: 'Importar' }}
    >
      {children}
    </Wizard>
  );
}
