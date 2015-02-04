#ifndef _LOG_TEST_H
#define _LOG_TEST_H

#include "calculator.h"

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

/*
Számítsok eredményeinek ellenőrzése
* Minta tesztekkel
* Standard input-ra való kiiratással
*/

//-----------------------------------------------------------------------
/** @name Tesztelő és Teszt generáló függvények*/
//@{
	// Minden teszt lefuttatása, ha nincs hiba futnak
	bool testAll();
	// Interpoláció tesztek lefuttatása
	void testInterpolation(bool logPoly = false);
	// fő függvény teszje
	bool testMainInterpolation(bool logPoly = false);
	// Newton számítás tesztje
	bool testNewton(bool logPoly = false);
	// Lagrange Interpoláció tesztje
	bool testLagrange(bool logPoly = false);
	// Polinom tesztje
	void testPolynomial();
	// Interpolációs Mátrix tesztje
	void testMatrixInterpolation();
	// Manuális Interpolációs teszt
	void testManualInterpolation();
	// Manuális Polinom tesztelő 
	void testManualPolynomial();

	/** generál egy minta X,Y ponthalmazt az x^2 pontjaiból */
	//testMatrixInterpolation Segédfüggvénye
	//feltölti az x*2 pontjaival 
	void genXSquaredPoints(DArray &X, DMatrix &Y);
//@}

/** @name Teszteléshez, teszt írásához és program javításhoz használt segédfüggvények */
//@{
	/** Két Tömb egyezésének ellenőrzése */
	bool checkEqual(DArray one, DArray two);
	/** Bool Vector ellenőrzése */
	bool checkVector(vector<bool> checks);

	/** @name Kiirató függvények */
	//@{
		/** Polinom alakban jelenít meg egy Vector-t
		    Ez kompatibilis a tényleges számítással.
		    (WolframAlpha-ba egyszerűen bemásolható) */
		void logPolynomial(DArray P, string poliName);
		/** Kiírja egymás után egy Vector elemeit a képernyőre */
		void logVector(DArray P, string vectorName);
		/** Kiírja az Interpolációs Mátrix és az X eredményét */
		void logResult(DArray x, DMatrix M);
		/** Kiírja az Interpolációs Mátrix számítási logikájának egy részletét */
		void logCalculate(int i, int j, DMatrix M, DArray x);
	//@}

	/** @name Manuális bekérő függvények */
	//@{
		/** Vektor (Polinom, Ponthalmaz)*/
		void getVectorStd(DArray &P, string poliName);
		/** Pontok Newton-hoz (X és a kezdő mátrix Y pontjai)*/
		void getPointsStd(DArray &x, DMatrix &M);
	//@}
//@}
#endif